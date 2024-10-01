'use client'

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addSlot } from "@/actions/server-actions";
import { Text } from "@/components/typography";
import { TimeSlot } from "@/components/scheduling/time-slot";
import { ActionsOnDayCard } from "@/components/scheduling/actions-on-day-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slot } from "@prisma/client";

const DAYSOFWEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function DayCard(props: {
  day: string;
  slots: Slot[];
  recurringOnly: boolean;
  weekDays: string[];
}) {
  const router = useRouter();
  const date = new Date(props.day)
  const daysExceptToday = props.weekDays.filter(d => d !== props.day);
  const filteredSlots = props.recurringOnly ? props.slots.filter((s) => s.recurring === true) : props.slots

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
  
  return (
    <div style={{ aspectRatio: '3/4' }} className='relative h-full col-span-1 flex flex-col border border-border rounded-md'>
      <Text variant='p-base-thick' className={cn('p-3 mb-4', new Date() < new Date(`${props.day}T23:59:59.999Z`) ? 'text-foreground' : 'text-muted-foreground')}>{DAYSOFWEEK[date.getDay()]}</Text>
      <div className="h-full overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
        {filteredSlots.length > 0 ? (
          <div>
            <div className='w-full h-full flex flex-col gap-2 pl-3 pr-2 mb-[48px]'>
              {filteredSlots.map((s) => { return <TimeSlot key={s.id} slot={s} daysExceptToday={daysExceptToday} /> })}
            </div>
            <div className='absolute bottom-0 left-0 right-0 flex justify-between p-3 rounded-b-md bg-background-sh'>
              <ActionsOnDayCard daysExceptToday={daysExceptToday}/>
              {/* Add 2nd case for adding recurring slot */}
              <Button onClick={() => handleAddSlot(props.day) } size='icon' className='size-8'>
                <Plus size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <>
            {new Date() <= new Date(new Date(props.day).setHours(23, 59, 59, 999)) ? (
              <div className='absolute top-0 bottom-0 left-0 right-0 flex flex-col p-3 justify-center items-center gap-2 mt-4'>
                <Text variant='p-small-thin' className='w-full text-center text-muted-foreground text-balance'>There are no slots created yet</Text>
                <Button onClick={() => handleAddSlot(props.day)} size='sm' variant='outline'>
                  <Plus className='size-4 -ml-2 mr-2'/>
                  Add slot
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