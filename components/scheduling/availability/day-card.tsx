"use client"

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { addSlot, addRecurringSlot } from "@/actions/database-actions";
import { TimeSlot } from "@/components/scheduling/availability/time-slot";
import { DayCardActions } from "@/components/scheduling/availability/day-card-actions";
import { Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slot, SLOTTYPE } from "@prisma/client";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function DayCard(props: {
  weekNumber: number;
  day: string;
  slots: Slot[];
  isRecurringSlotsOnly: boolean;
  weekDays: string[];
  recurringDays: string[];
}) {
  const router = useRouter();
  const date = useMemo(() => new Date(props.day), [props.day]);
  
  const isRecurringDay = props.recurringDays.includes(props.day);
  const daysExceptToday = props.weekDays.filter(d => d !== props.day);
  const filteredSlots = props.isRecurringSlotsOnly ? props.slots.filter((s) => s.recurring === true && s.type !== SLOTTYPE.BOOKED) : props.slots.filter((s) => s.type !== SLOTTYPE.BOOKED);

  async function handleAddSlot() {
    try {
      const addingSlot = await addSlot(props.day);
      if (addingSlot.status !== 201) {
        toast.error(addingSlot.message);
        return;
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }
  
  async function handleAddRecurringSlot() {
    try {
      const addingRecurringSlot = await addRecurringSlot(props.day);
      if (addingRecurringSlot.status !== 201) {
        toast.error(addingRecurringSlot.message);
        return;
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }

  return (
    <div style={{ aspectRatio: '3/4' }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh">
      <div className="w-full flex justify-between items-center p-3">
        <Text variant='p-base-thick' className={cn('mb-2', new Date() < new Date(`${props.day}T23:59:59.999Z`) ? 'text-foreground' : 'text-muted-foreground')}>{DAYS_OF_WEEK[date.getDay()]}</Text>
        <Text variant='p-small-thin' className={cn('mb-2', new Date() < new Date(`${props.day}T23:59:59.999Z`) ? 'text-foreground' : 'text-muted-foreground')}>
          {String(date.getDate()).padStart(2, '0')}.{String(date.getMonth() + 1).padStart(2, '0')}
        </Text>
      </div>
      <div className="h-full overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
        {filteredSlots.length > 0 ? (
          <div>
            <div className='w-full h-full flex flex-col gap-2 pt-2 pl-3 pr-2 mb-[72px]'>
              {filteredSlots.map((s) => {
                return (
                  <TimeSlot key={s.id} slot={s} daysExceptToday={daysExceptToday} />
                )
              })}
            </div>
            <div className='absolute bottom-0 left-0 right-0 flex justify-between p-3 rounded-b-md bg-background-sh'>
              <DayCardActions weekNumber={props.weekNumber} day={props.day} slots={props.slots} weekDays={props.weekDays} isRecurringDay={isRecurringDay}/>
              <Button onClick={props.isRecurringSlotsOnly ? handleAddRecurringSlot : handleAddSlot} size='icon' className={cn('size-8', props.isRecurringSlotsOnly ? 'bg-teal-500 hover:bg-teal-500/90' : '')}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <>
            {new Date() <= new Date(new Date(props.day).setHours(23, 59, 59, 999)) ? (
              <div className='absolute top-0 bottom-0 left-0 right-0 flex flex-col p-3 justify-center items-center gap-2 mt-4'>
                <Text variant='p-small-thin' className='w-full text-center text-muted-foreground text-balance'>
                  There are no {props.isRecurringSlotsOnly && ' recurring '} slots created yet
                </Text>
                <Button onClick={props.isRecurringSlotsOnly ? handleAddRecurringSlot : handleAddSlot} size='sm' variant='outline'>
                  <Plus className='size-4 -ml-2 mr-2'/>
                  {props.isRecurringSlotsOnly ? 'Add recurring slot' : 'Add slot'}
                </Button>
              </div>
            ) : (
              <div className='absolute top-0 bottom-0 left-0 right-0 flex flex-col p-3 justify-center items-center gap-2 mt-4'>
                <Text variant='p-small-thin' className='w-full text-center text-muted-foreground text-balance'>There are no slots available.</Text>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}