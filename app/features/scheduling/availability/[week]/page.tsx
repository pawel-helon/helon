import { getPrevNextWeeks, getRecurringDays, getWeekDays, getWeeks, getWeekSlots, getYearAndWeek } from '@/lib/helpers';
import { Header } from '@/components/features/scheduling/availability/header';
import { DayGrid } from '@/components/features/scheduling/availability/day-grid'
import { Tabs } from '@/components/features/scheduling/availability/tabs';
import { Breadcrumbs } from '@/components/features/scheduling/availability/breadcrumbs';

export default async function WeekAvailabilityPage(props: { params: { week: string } }) {
  const { year, weekNumber } = getYearAndWeek(props.params.week);
  const weeks = getWeeks(year);
  const weekDays = getWeekDays(year, weekNumber);
  const weekSlots = await getWeekSlots(weekDays);
  const recurringDays = await getRecurringDays(weekDays);
  const { prevWeekNumber, nextWeekNumber, yearOnBackwardNavigation, yearOnForewardNavigation } = getPrevNextWeeks(weekDays, weekNumber);

  return (
    <div className='pb-16'>
      <Breadcrumbs />
      <Header
        weeks={weeks}
        weekNumber={weekNumber}
        weekDays={weekDays}
        prevWeekNumber={prevWeekNumber} 
        yearOnBackwardNavigation={yearOnBackwardNavigation} 
        nextWeekNumber={nextWeekNumber} 
        yearOnForewardNavigation={yearOnForewardNavigation}
      />
      <Tabs />
      <DayGrid
        slots={weekSlots} 
        weekNumber={weekNumber} 
        weekDays={weekDays} 
        recurringDays={recurringDays}
      />
    </div>
  )
}
