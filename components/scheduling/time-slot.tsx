import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { updateSlotHour, updateSlotMinutes } from "@/actions/server-actions";
import { ActionsOnTimeSlot } from "@/components/scheduling/actions-on-time-slot";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Slot } from "@prisma/client";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

export function TimeSlot(props: { slot: Slot, daysExceptToday: string[] }) {
  const router = useRouter();
  const [hourDropdownOpened, setHourDropdownOpened] = useState<boolean>(false);
  const [minutesDropdownOpened, setMinutesDropdownOpened] = useState<boolean>(false);
  
  async function handleSlotHourChange(slotId: string, dateTime: Date, hour: string) {
    try {
      const updatingSlot = await updateSlotHour(slotId, dateTime, hour);
      if (updatingSlot.status !== 200) {
        toast.error('Failed to update slot');
        return;
      } else {
        router.refresh();
        setHourDropdownOpened(false);
      }
    } catch {
      toast.error('Failed to update slot');
    }
  }
  
  async function handleSlotMinutesChange(slotId: string, dateTime: Date, minutes: string) {
    try {
      const updatingSlot = await updateSlotMinutes(slotId, dateTime, minutes);
      if (updatingSlot.status !== 200) {
        toast.error('Failed to update slot');
        return;
      } else {
        router.refresh();
        setMinutesDropdownOpened(false);
      }
    } catch {
      toast.error('Failed to update slot');
    }
  }

  return (
    <div className="w-full flex justify-between items-center">
      <div className="relative flex gap-2">
          {props.slot.recurring && <span className="size-2 absolute -top-1 -left-1 rounded-full bg-teal-500"></span>}
          <DropdownMenu open={hourDropdownOpened} onOpenChange={setHourDropdownOpened}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-16 min-w-[64px]">
                {String(props.slot.dateTime.getHours()).padStart(2, '0')}
                <CaretSortIcon className="size-4 ml-2 text-muted-foreground"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-16 min-w-[64px] flex flex-col bg-black shadow-black shadow-md">
              <div className="w-full flex flex-col gap-2 max-h-[140px] pl-3 pr-2 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
                {HOURS.map((hours) => {
                  return (
                    <Button key={hours} onClick={() => handleSlotHourChange(props.slot.id, props.slot.dateTime, hours)} variant="ghost" size="sm" className="w-full h-7 justify-start pl-2">
                      {hours}
                    </Button>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        <DropdownMenu open={minutesDropdownOpened} onOpenChange={setMinutesDropdownOpened}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-16 min-w-[64px]">
              {String(props.slot.dateTime.getMinutes()).padStart(2, '0')}
              <CaretSortIcon className="size-4 ml-2 text-muted-foreground"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-16 min-w-[64px] flex flex-col bg-background-sh shadow-black shadow-md">
            <div className="w-full flex flex-col gap-2 max-h-[140px] pl-3 pr-2 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
              {MINUTES.map((minutes) => {
                return (
                  <Button key={minutes} onClick={() => handleSlotMinutesChange(props.slot.id, props.slot.dateTime, minutes)} variant="ghost" size="sm" className="w-full h-7 justify-start pl-2" >
                    {minutes}
                  </Button>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ActionsOnTimeSlot slot={props.slot} daysExceptToday={props.daysExceptToday}/>
    </div>
  )
}
