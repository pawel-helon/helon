import { getWeek } from "@/lib/helpers";
import { redirect } from "next/navigation";

export default async function MeetingsRootPage() {
  const { year, weekNumber } = await getWeek();
  redirect(`/features/scheduling/meetings/${year}-week-${weekNumber}/monday`);
}
