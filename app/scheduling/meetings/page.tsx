import { redirect } from "next/navigation";

export default async function MeetingsPage() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  const monday = new Date(today.setDate(today.getDate() + diffToMonday));
  const yearStart = new Date(monday.getFullYear(), 0 , 1)
  const weekNumber = Math.ceil((((monday.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)

  redirect(`/scheduling/meetings/week-${weekNumber}`)
}
