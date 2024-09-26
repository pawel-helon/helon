import { getSlotsForWeek } from "@/actions/server-actions";
import { Availability } from "@/components/availability";
import { Slot } from "@prisma/client";

type DaySlots = { day: string; slots: Slot[] };

export default async function AvailabilityPage() {
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const monday = new Date(today.setDate(today.getDate() + diffToMonday));
    const dateTime = new Date(monday.setDate(monday.getDate() + i));
    const date = `${dateTime.getFullYear()}-${String(dateTime.getMonth() + 1).padStart(2, '0')}-${String(dateTime.getDate()).padStart(2, '0')}`
    return date;
  })

  const gettingSlotsForCurrentWeek = await getSlotsForWeek(currentWeek);
  return <Availability currentWeek={currentWeek} currentWeekSlots={gettingSlotsForCurrentWeek.weekSlots as DaySlots[]} />;
}