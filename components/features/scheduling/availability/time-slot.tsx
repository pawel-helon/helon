"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { getSlotTime } from "@/lib/helpers";
import { HOURS, MINUTES } from "@/lib/constants";
import { updateSlotHour, updateSlotMinute } from "@/actions/database-actions";
import { TimeSlotActions } from "@/components/features/scheduling/availability/time-slot-actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Slot } from "@prisma/client";

export function TimeSlot(props: { slot: Slot }) {
  const router = useRouter();
  const { hour, minute } = getSlotTime(props.slot.dateTime);
  const [isHoursDropdownOpened, setIsHoursDropdownOpened] = useState<boolean>(false);
  const [isMinutesDropdownOpened, setIsMinutesDropdownOpened] = useState<boolean>(false);
  
  async function handleSlotHourChange(hour: string) {
    try {
      const updatingSlot = await updateSlotHour(props.slot.id, props.slot.dateTime, hour);
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
      const updatingSlot = await updateSlotMinute(props.slot.id, props.slot.dateTime, minute);
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
        {props.slot.recurring && <span className="size-2 absolute -top-1 left-0 xs:-left-1 rounded-full bg-teal-500" />}
        <DropdownMenu open={isHoursDropdownOpened} onOpenChange={setIsHoursDropdownOpened}>
          <DropdownMenuTrigger asChild id="temp">
            <Button
              aria-label="Change hour"
              variant="outline"
              size="sm"
              className="w-16 min-w-[64px] bg-background-sh"
            >
              {hour}
              <CaretSortIcon className="size-4 ml-2 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-16 min-w-[64px] flex flex-col shadow-black shadow-sm bg-background-sh">
            <div className="w-full max-h-[320px] flex flex-col pr-1 gap-0.5 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
              {HOURS.map((hour) => (
                <Button
                  key={hour}
                  role="option"
                  tabIndex={0}
                  onClick={() => handleSlotHourChange(hour)}
                  variant="ghost"
                  size="sm"
                  className="h-8 py-2"
                >
                  {hour}
                </Button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu open={isMinutesDropdownOpened} onOpenChange={setIsMinutesDropdownOpened}>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Change minutes"
              variant="outline"
              size="sm"
              className="w-16 min-w-[64px] bg-background-sh"
            >
              {minute}
              <CaretSortIcon className="size-4 ml-2 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-16 min-w-[64px] flex flex-col shadow-black shadow-sm bg-background-sh">
            <div className="w-full max-h-[140px] flex flex-col gap-0.5">
              {MINUTES.map((minute) => (
                <Button
                  role="option"
                  key={minute} 
                  onClick={() => handleSlotMinuteChange(minute)} 
                  variant="ghost" 
                  size="sm" 
                  className="w-full h-8 py-2"
                >
                  {minute}
                </Button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <TimeSlotActions slot={props.slot} />
    </div>
  )
}
