import Link from 'next/link';
import { cache } from 'react'
import { checkRecurringDays, getSlotsForWeek } from '@/actions/server-actions'
import { Header } from '@/components/features/scheduling/header-availability';
import { DayGrid } from '@/components/scheduling/availability/day-grid'
import { Slot } from '@prisma/client';
import { Breadcrumbs } from '@/components/features/scheduling/breadcrumbs';

type Week = { weekNumber: number; firstDay: string; lastDay: string };

const cachedWeeks = cache((year: number) => {
  const yearStart = new Date(year, 0, 1).getDay();
  const yearEnd = new Date(year, 11, 31).getDay();
  let weekNumber: number = 0;
  let firstDay: string = '';
  let lastDay: string = '';
  const weeks: Week[] = [];

  for (weekNumber = 1; weekNumber <= 53; weekNumber++) {
    if (weekNumber === 1) {
      firstDay = `${year}-01-01`;
      lastDay = `${year}-01-0${8 - yearStart}`;
      weeks.push({weekNumber, firstDay, lastDay});
    } else if (weekNumber === 53) {
      firstDay = `${year}-12-${31 - ( yearEnd - 1 )}`;
      lastDay = `${year}-12-31`;
      weeks.push({weekNumber, firstDay, lastDay});
    } else {
      const firstDayDate = new Date(year, 0, 1 + (weekNumber - 1) * 7 - (yearStart || 7) + 1);
      const lastDayDate = new Date(year, 0, 1 + (weekNumber - 1) * 7 - (yearStart || 7) + 7);
      firstDay = `${firstDayDate.getFullYear()}-${firstDayDate.getMonth() + 1}-${firstDayDate.getDate()}`;
      lastDay = `${lastDayDate.getFullYear()}-${lastDayDate.getMonth() + 1}-${lastDayDate.getDate()}`;
      weeks.push({weekNumber, firstDay, lastDay});
    }
  }
  return weeks;
})

type DaySlots = { day: string, slots: Slot[] };

const cachedWeekDays = cache((year: number, week: number) => {
  if (week < 1 || week > 53 || year < new Date().getFullYear() || year > 2100) {
    throw new Error;
  }
  
  const yearStart = new Date(year, 0, 1).getDay();
  const yearEnd = new Date(year, 11, 31).getDay();
  let i: number = 0;
  let weekDay: string = '';
  let weekDays: string[] = [];

  if (week === 1) {
    if (yearStart > 0) {
      for (i = yearStart; i <= 7; i++) {
        weekDay = `${year}-01-0${i - yearStart + 1}`;
        weekDays.push(weekDay);
      }
    } else {
      weekDay = `${year}-01-01`;
      weekDays.push(weekDay);
    }
  } else if (week === 53) {
      if (yearEnd > 0) {
        for (i = 31 - ( yearEnd - 1 ); i <= 31; i++) {
          weekDay = `${year}-12-${i}`;
          weekDays.push(weekDay);
        }
      } else {
        weekDay = `${year}-12-31`;
        weekDays.push(weekDay);
      }
  } else {
    const firstWeekday = new Date(year, 0, 1 + (week - 1) * 7 - (yearStart || 7) + 1);
    weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(firstWeekday);
      date.setDate(firstWeekday.getDate() + i);
      return `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    });
  }
  return weekDays
});

const cachedWeekSlots = cache(async (weekDays: string[]) => {
  const slotsForWeek = await getSlotsForWeek(weekDays);
  const weekSlots = slotsForWeek.weekSlots as DaySlots[];
  return weekSlots;
})
const cachedRecurringDays = cache(async (weekDays: string[]) => {
  const checkingRecurringDays = await checkRecurringDays(weekDays);
  const recurringDays = checkingRecurringDays.recurringDays as string[];
  return recurringDays;
})

function getPrevNextWeeks(weekDays: string[], weekNumber: number) {
  const prevWeek = Array.from({ length: 7 }, (_, i) => new Date(new Date(weekDays[0]).setDate(new Date(weekDays[0]).getDate() + i - 7)).toISOString().split('T')[0]);
  const nextWeek = Array.from({ length: 7 }, (_, i) => new Date(new Date(weekDays[0]).setDate(new Date(weekDays[0]).getDate() + i + 7)).toISOString().split('T')[0]);
  const yearOnBackwardNavigation: number = new Date(prevWeek[0]).getFullYear();
  const yearOnForewardNavigation: number = new Date(nextWeek[nextWeek.length - 1]).getFullYear();

  let prevWeekNumber: number = weekNumber
  if (new Date(weekDays[0]).getFullYear() > new Date(prevWeek[prevWeek.length - 1]).getFullYear()) {
    prevWeekNumber = 53;
  } else {
    prevWeekNumber = weekNumber - 1;
  }

  let nextWeekNumber: number = weekNumber
  if (new Date(weekDays[weekDays.length - 1]).getFullYear() < new Date(nextWeek[prevWeek.length - 1]).getFullYear()) {
    nextWeekNumber = 1;
  } else {
    nextWeekNumber = weekNumber + 1;
  }
  return { prevWeekNumber, nextWeekNumber, yearOnBackwardNavigation, yearOnForewardNavigation };
}

export default async function WeekAvailabilityPage(props: { params: { week: string } }) {
  const year = Number(props.params.week.split('-')[0]);
  const weeks = cachedWeeks(year);
  const weekNumber = Number(props.params.week.split('-')[2]);
  const weekDays = cachedWeekDays(year, weekNumber);
  const weekSlots = await cachedWeekSlots(weekDays);
  const recurringDays = await cachedRecurringDays(weekDays);
  const { prevWeekNumber, nextWeekNumber, yearOnBackwardNavigation, yearOnForewardNavigation } = getPrevNextWeeks(weekDays, weekNumber);
  const prevWeekDays = cachedWeekDays(year, prevWeekNumber);
  const nextWeekDays = cachedWeekDays(year, nextWeekNumber);

  return (
    <>
      <Breadcrumbs />
      <Header
        weeks={weeks}
        weekNumber={weekNumber}
        weekDays={weekDays}
        prevWeekNumber={prevWeekNumber} 
        prevWeekDays={prevWeekDays}
        yearOnBackwardNavigation={yearOnBackwardNavigation} 
        nextWeekNumber={nextWeekNumber} 
        nextWeekDays={nextWeekDays}
        yearOnForewardNavigation={yearOnForewardNavigation}
      />
      <ul role="tablist" className="h-11 mb-8 flex border-b border-border">
        <li role="tab" className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-3 py-1 text-sm font-medium hover:cursor-pointer ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 text-muted-foreground shadow border-b border-muted-foreground">
          <Link href="/features/scheduling/meetings" prefetch={true}>
            Meetings
          </Link>
        </li>
        <li role="tab" className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-3 py-1 text-sm font-medium hover:cursor-pointer ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 text-primary shadow border-b border-primary">
          <Link href="/features/scheduling/availability" prefetch={true}>
            Availability
          </Link>
        </li>
      </ul>
      <DayGrid slotsForWeek={weekSlots} weekNumber={weekNumber} weekDays={weekDays} recurringDays={recurringDays}/>
    </>
  )
}
