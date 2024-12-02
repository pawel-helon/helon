import { getPrevNextWeeks, getWeekDays, getWeekMeeting, getWeeks, getYearAndWeek } from "@/lib/helpers";
import { SelectDayOfWeek } from "@/components/features/scheduling/meetings/select-day-of-week";
import { Breadcrumbs } from "@/components/features/scheduling/meetings/breadcrumbs";
import { Header } from "@/components/features/scheduling/meetings/header";
import { Tabs } from "@/components/features/scheduling/meetings/tabs";
import { DayList } from "@/components/features/scheduling/meetings/day-list";

export default async function MeetingsLayout(props: {
  params: { week: string };
  children: React.ReactNode;
}) {
  const { year, weekNumber } = getYearAndWeek(props.params.week)
  const weeks = getWeeks(year);
  const weekDays = getWeekDays(year, weekNumber);
  const weekMeetings = await getWeekMeeting(weekDays);
  const {
    prevWeekNumber,
    nextWeekNumber,
    yearOnBackwardNavigation,
    yearOnForewardNavigation
  } = getPrevNextWeeks(weekDays, weekNumber);

  return (
    <div id="meetings">
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
      <SelectDayOfWeek year={year} weekNumber={weekNumber} weekDays={weekDays}/>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:pt-9">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
          {props.children}
        </div>
        <div className="hidden md:col-span-1 md:flex flex-col gap-4">
          <DayList weekNumber={weekNumber} weekMeetings={weekMeetings} weekDays={weekDays} />
        </div>
      </div>
    </div>
  )
}
