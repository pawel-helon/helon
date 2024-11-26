"use client"

import { useState } from "react";
import { toast } from "sonner";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { updateSlotHour, updateSlotMinute } from "@/actions/database-actions";
import { TimeSlotActions } from "@/components/scheduling/availability/time-slot-actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Slot } from "@prisma/client";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

function getSlotTime(dateTime: Date) {
  const initHour = String(new Date(dateTime).getHours()).padStart(2, '0');
  const initMinutes = String(new Date(dateTime).getMinutes()).padStart(2, '0');
  return { initHour, initMinutes };
}

export function TimeSlot(props: { slot: Slot, daysExceptToday: string[] }) {
  const { initHour, initMinutes } = getSlotTime(props.slot.dateTime)
  const [hour, setHour] = useState<string>(initHour);
  const [minutes, setMinutes] = useState<string>(initMinutes);
  const [isHoursDropdownOpened, setIsHoursDropdownOpened] = useState<boolean>(false);
  const [isMinutesDropdownOpened, setIsMinutesDropdownOpened] = useState<boolean>(false);

  async function handleSlotHourChange(hour: string) {
    setHour(hour);
    try {
      const updatingSlot = await updateSlotHour(props.slot.id, props.slot.dateTime, hour, minutes);
      if (updatingSlot.status !== 200) {
        toast.error(updatingSlot.message);
        setHour(initHour);
        return;
      }
      setIsHoursDropdownOpened(false);
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }
  
  async function handleSlotMinuteChange(minute: string) {
    setMinutes(minute);
    try {
      const updatingSlot = await updateSlotMinute(props.slot.id, props.slot.dateTime, hour, minute);
      if (updatingSlot.status !== 200) {
        toast.error(updatingSlot.message);
        setMinutes(initMinutes);
        return;
      }
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
              {minutes}
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
      <TimeSlotActions slot={props.slot} daysExceptToday={props.daysExceptToday} />
    </div>
  )
}
