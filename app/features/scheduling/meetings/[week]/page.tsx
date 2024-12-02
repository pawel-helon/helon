import { redirect } from "next/navigation";
import { getNameOfDay, getWeek, getWeekDays } from "@/lib/helpers";

export default async function MeetingsPage() {
  const { year, weekNumber } = await getWeek();
  const weekDays = getWeekDays(year, weekNumber);
  const day = getNameOfDay(weekDays[0]).toLowerCase();
  redirect(`/features/scheduling/meetings/${year}-week-${weekNumber}/${day}`);
}
