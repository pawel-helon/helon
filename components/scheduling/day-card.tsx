"use client"

import { cn } from "@/lib/utils";
import { Slot } from "@prisma/client";
import { Text } from "../typography";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown, Plus } from "lucide-react";
import { TimeSlot } from "./time-slot";
import { toast } from "sonner";
import { addSlot, duplicateSlots } from "@/actions/server-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DAYSOFWEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function DayCard(props: {
  day: string;
  slots: Slot[];
  weekDays: string[];
}) {
  const router = useRouter();
  const [duplicateDropdownOpened, setDuplicateDropdownOpened] = useState<boolean>(false);
  
  const date = new Date(props.day)
  const notToday = props.weekDays.filter(d => d !== props.day);

  async function handleAddSlot(day: string) {
    try {
      const addingSlot = await addSlot(day);
      if (addingSlot.status !== 201) {
        toast.error('Failed to add slot');
        return;
      } else {
        router.refresh();
      }
    } catch {
      toast.error('Failed to add slot');
    }
  }

  async function handleDuplicateSlots(dayToDuplicate: string, slots: Slot[]) {
    try {
      const duplicatingSlots = await duplicateSlots(dayToDuplicate, slots);
      if (duplicatingSlots.status !== 201) {
        toast.error('Failed to duplicate slots');
        return;
      } else {
        setDuplicateDropdownOpened(false);
        router.refresh();
      }
    } catch {
      toast.error('Failed to duplicate slots');
    }
  }
  
  return (
    <div style={{ aspectRatio: '3/4' }} className='relative col-span-1 flex flex-col p-3 border border-border rounded-md'>
      <Text variant="p-base-thick" className={cn(new Date() < new Date(`${props.day}T23:59:59.999Z`) ? "text-foreground" : "text-muted-foreground")}>{DAYSOFWEEK[date.getDay()]}</Text>
      <div className="flex flex-col gap-2 mt-4">
        {props.slots.length > 0 ? (
          <>
            <div className="w-full flex flex-col gap-2 max-h-[200px] pr-1 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
              {props.slots.map((slot) => {
                return <TimeSlot key={slot.id} slot={slot}/>;
              })}
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
              <DropdownMenu open={duplicateDropdownOpened} onOpenChange={setDuplicateDropdownOpened}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-[104px] min-w-[104px] pr-2">
                    Duplicate
                    <ChevronDown size={16} className="size-4 ml-2"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[104px] min-w-[104px] flex flex-col bg-black shadow-black shadow-md">
                  {notToday.map((dayToDuplicate) => {
                    return (
                      <Button key={dayToDuplicate} onClick={() => handleDuplicateSlots(dayToDuplicate, props.slots)} variant="ghost" size="sm" className="justify-start pl-2" >
                        {DAYSOFWEEK[new Date(dayToDuplicate).getDay()]}
                      </Button>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => handleAddSlot(props.day) } size="icon" variant="outline">
                <Plus size={16} />
              </Button>
            </div>
          </>
        ) : (
          <>
            {new Date() <= new Date(new Date(props.day).setHours(23, 59, 59, 999)) ? (
              <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col p-2 justify-center items-center gap-2 mt-4">
                <Text variant="p-small-thin" className="w-full text-center text-muted-foreground text-balance">There are no slots created yet</Text>
                <Button onClick={() => handleAddSlot(props.day)} size="sm" variant="outline">
                  <Plus className="size-4 -ml-2 mr-2"/>
                  Add slot
                </Button>
              </div>
            ) : (
              <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col p-2 justify-center items-center gap-2 mt-4">
                <Text variant="p-small-thin" className="w-full text-center text-muted-foreground text-balance">There are no slots available.</Text>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}