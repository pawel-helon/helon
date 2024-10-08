import { cache } from 'react'
import { getSlotsForWeek } from '@/actions/server-actions'
import { AvailabilityHeader } from '@/components/scheduling/availability-header'
import { DayGrid } from '@/components/scheduling/day-grid'
import { Slot } from '@prisma/client';

type DaySlots = { day: string, slots: Slot[] };

const cachedWeekDays = cache((weekNumber: number) => {
  const today = new Date()
  const yearStart = new Date(today.getFullYear(), 0, 1)
  const dayOfWeek = yearStart.getDay()
  const firstWeekday = new Date(yearStart.getFullYear(), 0, 1 + (weekNumber - 1) * 7 - dayOfWeek + 1)
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(firstWeekday)
    date.setDate(firstWeekday.getDate() + i)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  })
})

const cachedGetSlotsForWeek = cache(getSlotsForWeek)

export default async function WeekAvailabilityPage(props: { params: { week: string } }) {
  const weekNumber = Number(props.params.week.split('-')[1])

  const weekDays = cachedWeekDays(weekNumber)
  const slotsForWeek = await cachedGetSlotsForWeek(weekDays);
  const weekSlots = slotsForWeek.weekSlots as DaySlots[];

  return (
    <>
      <AvailabilityHeader weekNumber={weekNumber} weekDays={weekDays} />
      <DayGrid slotsForWeek={weekSlots} weekDays={weekDays} />
    </>
  )
}
