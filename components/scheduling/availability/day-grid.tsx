"use client"

import { useEffect, useState } from "react";
import { deletePastSlots } from "@/actions/database-actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slot } from "@prisma/client";
import { DayCard } from "@/components/scheduling/availability/day-card";

type DaySlots = { day: string, slots: Slot[] };

export function DayGrid(props: {
  slotsForWeek: DaySlots[];
  weekNumber: number;
  weekDays: string[];
  recurringDays: string[];
}) {
  const [isRecurringSlotsOnly, setIsRecurringSlotsOnly] = useState<boolean>(false);
  
  useEffect(() => {
    async function initDeletePastSlots() {
      try {
        deletePastSlots();
      } catch (error) {
        console.error(error);
      }
    }
    initDeletePastSlots();
  })

  const emptyCards: number[] = [];
  let i: number = 0;
  for (i = 1; i <= 7 - props.weekDays.length; i++) {
    emptyCards.push(i);
  }
  
  return (
    <>
      <div className='w-full flex justify-end items-center gap-2 mb-4'>
        <Label htmlFor='only-recurring' className='text-xs text-muted-foreground'>Recurring only</Label>
        <Switch checked={isRecurringSlotsOnly} onCheckedChange={() => setIsRecurringSlotsOnly(!isRecurringSlotsOnly)} className='data-[state=checked]:bg-teal-500'/>
      </div>
      <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-4 mb-16'>
        {props.weekNumber === 1 && (
          <>
            {emptyCards.map((card) => {
              return (
                <div key={card} style={{ aspectRatio: '3/4' }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh" />
              )
            })}
          </>
        )}
        {props.slotsForWeek.map((day) => {
          return (
            <DayCard key={day.day} weekNumber={props.weekNumber} day={day.day} slots={day.slots} isRecurringSlotsOnly={isRecurringSlotsOnly} weekDays={props.weekDays} recurringDays={props.recurringDays}/>
          )
        })}
        {props.weekNumber === 53 && (
          <>
            {emptyCards.map((card) => {
              return (
                <div key={card} style={{ aspectRatio: '3/4' }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh" />
              )
            })}
          </>
        )}
      </div>
    </>
  )
}