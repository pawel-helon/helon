"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { updateSlotHour, updateSlotMinute } from "@/actions/database-actions";
import { TimeSlotActions } from "@/components/scheduling/availability/time-slot-actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Slot } from "@prisma/client";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

export function TimeSlot(props: { slot: Slot, daysExceptToday: string[] }) {
  const router = useRouter();
  const [isHoursDropdownOpened, setIsHoursDropdownOpened] = useState<boolean>(false);
  const [isMinutesDropdownOpened, setIsMinutesDropdownOpened] = useState<boolean>(false);
  
  async function handleSlotHourChange(hour: string) {
    try {
      const updatingSlot = await updateSlotHour(props.slot.id, props.slot.dateTime.toISOString(), hour);
      if (updatingSlot.status !== 200) {
        toast.error(updatingSlot.message);
        return;
      }
      router.refresh();
      setIsHoursDropdownOpened(false);
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }
  
  async function handleSlotMinuteChange(minute: string) {
    try {
      const updatingSlot = await updateSlotMinute(props.slot.id, props.slot.dateTime.toISOString(), minute);
      if (updatingSlot.status !== 200) {
        toast.error(updatingSlot.message);
        return;
      }
      router.refresh();
      setIsMinutesDropdownOpened(false);
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }

  return (
    <div className="w-full flex justify-between items-center">
      <div className="relative flex gap-2">
        {props.slot.recurring && <span className="size-2 absolute -top-1 left-0 xs:-left-1 rounded-full bg-teal-500"></span>}
        <DropdownMenu open={isHoursDropdownOpened} onOpenChange={setIsHoursDropdownOpened}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-16 min-w-[64px] bg-background-sh">
              {String(props.slot.dateTime.getHours()).padStart(2, '0')}
              <CaretSortIcon className="size-4 ml-2 text-muted-foreground"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-16 min-w-[64px] flex flex-col shadow-black shadow-sm bg-background-sh">
            <div className="w-full max-h-[320px] flex flex-col pr-1 gap-0.5 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
              {HOURS.map((hour) => {
                return (
                  <Button key={hour} onClick={() => handleSlotHourChange(hour)} variant="ghost" size="sm" className="h-8 py-2">
                    {hour}
                  </Button>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu open={isMinutesDropdownOpened} onOpenChange={setIsMinutesDropdownOpened}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-16 min-w-[64px] bg-background-sh">
              {String(props.slot.dateTime.getMinutes()).padStart(2, '0')}
              <CaretSortIcon className="size-4 ml-2 text-muted-foreground"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-16 min-w-[64px] flex flex-col shadow-black shadow-sm bg-background-sh">
            <div className="w-full max-h-[140px] flex flex-col gap-0.5">
              {MINUTES.map((minute) => {
                return (
                  <Button key={minute} onClick={() => handleSlotMinuteChange(minute)} variant="ghost" size="sm" className="w-full h-8 py-2" >
                    {minute}
                  </Button>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <TimeSlotActions slot={props.slot} daysExceptToday={props.daysExceptToday}/>
    </div>
  )
}
