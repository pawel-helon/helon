import { redirect } from "next/navigation";

async function getWeek() {
  const today = new Date();
  const year = today.getFullYear();
  const dayOfWeek = today.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  const monday = new Date(today.setDate(today.getDate() + diffToMonday));
  const yearStart = new Date(monday.getFullYear(), 0 , 1);
  const weekNumber = Math.ceil((((monday.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { year, weekNumber };
}

export default async function MeetingsPage() {
  const { year, weekNumber } = await getWeek();
  redirect(`/scheduling/meetings/${year}-week-${weekNumber}`);
}
