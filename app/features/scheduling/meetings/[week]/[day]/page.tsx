import { getDayMeetings } from "@/actions/server-actions";
import { getFilteredDay, getWeekDays, getYearAndWeek } from "@/lib/helpers";
import { DayMeetings } from "@/components/features/scheduling/meetings/day-meetings";
import { Meeting } from "@prisma/client";

export default async function MeetingsDayPage(props: {
  params: { week: string; day: string }
}) {
  const { year, weekNumber } = getYearAndWeek(props.params.week);
  const weekDays = getWeekDays(year, weekNumber);
  const filteredDay = getFilteredDay(weekDays, props.params.day)
  const gettingDayMeetings = await getDayMeetings(filteredDay);
  const meetings = gettingDayMeetings.meetings as Meeting[];

  return <DayMeetings weekNumber={weekNumber} day={filteredDay} meetings={meetings} />;
}