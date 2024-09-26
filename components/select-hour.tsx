'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slot } from '@prisma/client'

export function SelectHour(props: {
  slot: Slot;
  day: { day: string; slots: Slot[]};
  HOURS: string[];
  handleUpdateSlotHour: (formData: FormData) => void;
}) {
  const [selectedHour, setSelectedHour] = useState(String(props.slot.dateTime.getHours()).padStart(2, '0'))

  const handleSelectChange = (value: string) => {
    setSelectedHour(value);
    window.location.reload();
    console.log(value)
    const form = document.getElementById(`updateSlotHourForm-${props.slot.id}`) as HTMLFormElement;
    form.requestSubmit();
  }
  
  return (
    <form id={`updateSlotHourForm-${props.slot.id}`} action={props.handleUpdateSlotHour}>
      <input type="hidden" name="slotId" value={props.slot.id} />
      <input type="hidden" name="dateTime" value={props.slot.dateTime.toISOString()} />
      <Select name="hour" value={selectedHour} onValueChange={() => handleSelectChange}>
        <SelectTrigger className="w-16 min-w-[64px]">
          <SelectValue placeholder={selectedHour} />
        </SelectTrigger>
        <SelectContent className="w-16 min-w-[64px] h-[180px] bg-black">
          <SelectGroup>
            {props.HOURS.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </form>
  )
}