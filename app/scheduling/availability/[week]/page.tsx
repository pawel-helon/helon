import Link from 'next/link';
import { cache } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { checkRecurringDays, getSlotsForWeek } from '@/actions/server-actions'
import { DayGrid } from '@/components/scheduling/availability/day-grid'
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Text } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slot } from '@prisma/client';

type DaySlots = { day: string, slots: Slot[] };

const cachedWeekDays = cache((year: number, week: number) => {
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
  return weekDays;
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

function getWeekBadgeVariant(weekNumber: number) {
  if (weekNumber > 11 && weekNumber < 25) {
    return "spring";
  } else if (weekNumber > 24 && weekNumber < 38) {
    return "summer";
  } else if (weekNumber > 37 && weekNumber < 51) {
    return "autumn";
  } else {
    return "winter";
  }
}

function getPrevNextWeeks(weekDays: string[], weekNumber: number) {
  const prevWeek = Array.from({ length: 7 }, (_, i) => new Date(new Date(weekDays[0]).setDate(new Date(weekDays[0]).getDate() + i - 7)).toISOString().split('T')[0]);
  const nextWeek = Array.from({ length: 7 }, (_, i) => new Date(new Date(weekDays[0]).setDate(new Date(weekDays[0]).getDate() + i + 7)).toISOString().split('T')[0]);
  const yearOnBackwardNavigation: number = new Date(prevWeek[0]).getFullYear();
  const yearOnForewardNavigation: number = new Date(nextWeek[6]).getFullYear();

  let prevWeekNumber: number = weekNumber
  if (new Date(weekDays[0]).getFullYear() > new Date(prevWeek[prevWeek.length - 1]).getFullYear()) {
    prevWeekNumber = 53;
  } else {
    prevWeekNumber = weekNumber - 1;
  }

  let nextWeekNumber: number = weekNumber
  if (new Date(weekDays[prevWeek.length - 1]).getFullYear() < new Date(nextWeek[prevWeek.length - 1]).getFullYear()) {
    nextWeekNumber = 1;
  } else {
    nextWeekNumber = weekNumber + 1;
  }
  return { prevWeekNumber, nextWeekNumber, yearOnBackwardNavigation, yearOnForewardNavigation };
}

export default async function WeekAvailabilityPage(props: { params: { week: string } }) {
  const year = Number(props.params.week.split('-')[0]);
  const weekNumber = Number(props.params.week.split('-')[2]);
  const weekDays = cachedWeekDays(year, weekNumber);
  const weekSlots = await cachedWeekSlots(weekDays);
  const recurringDays = await cachedRecurringDays(weekDays);
  const weekBadgeVariant = getWeekBadgeVariant(weekNumber);
  const { prevWeekNumber, nextWeekNumber, yearOnBackwardNavigation, yearOnForewardNavigation } = getPrevNextWeeks(weekDays, weekNumber);

  return (
    <>
      <Breadcrumbs />
      <div className="flex flex-col gap-2 my-[4rem] xs:mb-[5rem]">
        <div className="flex flex-col gap-2 my-[4rem] xs:mb-[5rem]">
          <div className="flex gap-2 items-center">
            <Link href={`/scheduling/availability/${yearOnBackwardNavigation}-week-${prevWeekNumber}`}>
              <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                <ChevronLeft size={18}/>
              </Button>
            </Link>
            <Link href={`/scheduling/availability/${yearOnForewardNavigation}-week-${nextWeekNumber}`}>
              <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                <ChevronRight size={18}/>
              </Button>
            </Link>
          </div>
          <div className="flex items-start gap-2">
            <Text variant="h1">Scheduling</Text>
            <Badge variant={weekBadgeVariant}>
              {`${String(new Date(weekDays[0]).getDate()).padStart(2, '0')}.${String(new Date(weekDays[0]).getMonth() + 1).padStart(2, '0')} - ${String(new Date(weekDays[weekDays.length - 1]).getDate()).padStart(2, '0')}.${String(new Date(weekDays[weekDays.length - 1]).getMonth() + 1).padStart(2, '0')}`}
            </Badge>
          </div>
        </div>
      </div>
      <div className="h-11 mb-8 flex border-b border-border">
        <Link href="/scheduling/meetings" prefetch={true} className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-3 py-1 text-sm font-medium hover:cursor-pointer ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 text-muted-foreground shadow border-b border-muted-foreground">
          Meetings
        </Link>
        <Link href="/scheduling/availability" prefetch={true} className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-3 py-1 text-sm font-medium hover:cursor-pointer ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 text-primary shadow border-b border-primary">
          Availability
        </Link>
      </div>
      <DayGrid slotsForWeek={weekSlots} weekNumber={weekNumber} weekDays={weekDays} recurringDays={recurringDays}/>
    </>
  )
}
