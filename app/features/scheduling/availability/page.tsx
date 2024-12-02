import { redirect } from "next/navigation";
import { getWeek } from "@/lib/helpers";

export default async function AvailabilityPage() {
  const { year, weekNumber } = await getWeek();
  redirect(`/features/scheduling/availability/${year}-week-${weekNumber}`);
}
