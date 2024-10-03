'use client'

import { useState } from "react";
import { DayCard } from "@/components/scheduling/day-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slot } from "@prisma/client";

type DaySlots = { day: string, slots: Slot[] };

export function DayGrid(props: {
  slotsForWeek: DaySlots[];
  weekDays: string[];
}) {
  const [recurringOnly, setRecurringOnly] = useState<boolean>(false);
  return (
    <>
      <div className='w-full flex justify-end items-center gap-2 mb-4'>
        <Label htmlFor='only-recurring' className='text-xs text-muted-foreground'>Recurring only</Label>
        <Switch checked={recurringOnly} onCheckedChange={() =>setRecurringOnly(!recurringOnly)} className='data-[state=checked]:bg-teal-500'/>
      </div>
      <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-4 mb-16'>
        {props.slotsForWeek.map((day) => {
          return <DayCard key={day.day} day={day.day} slots={day.slots} recurringOnly={recurringOnly} weekDays={props.weekDays} />;
        })}
      </div>
    </>
  )
}