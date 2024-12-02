"use client"

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { addSlot, addRecurringSlot } from "@/actions/database-actions";
import { getBadgeVariant, getDateOfMeeting, getDayOfWeek, getFilteredSlots, isBeforeEndOfDay } from "@/lib/helpers";
import { TimeSlot } from "@/components/features/scheduling/availability/time-slot";
import { DayCardActions } from "@/components/features/scheduling/availability/day-card-actions";
import { Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slot } from "@prisma/client";

export function DayCard(props: {
  weekNumber: number;
  day: string;
  slots: Slot[];
  isRecurringSlotsOnly: boolean;
  weekDays: string[];
  recurringDays: string[];
}) {
  const router = useRouter();
  const isRecurringDay = props.recurringDays.includes(props.day);
  const filteredSlots = getFilteredSlots(props.slots, props.isRecurringSlotsOnly);
  const badgeVariant = getBadgeVariant(props.weekNumber);

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
      toast.error("An unexpected error occurred. Please try again later.");
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
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }

  return (
    <>
      {/* Mobile breakpoint */}
      <div style={{ aspectRatio: "1" }} className="flex xs:hidden relative h-full col-span-1 flex-col bg-background-sh">
        {filteredSlots.length > 0 ? (
          <>
            <div className="w-full flex flex-col gap-2 pt-2 pl-2 pr-3 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
              {filteredSlots.map((s) => (
                <TimeSlot key={s.id} slot={s} />
              ))}
            </div>
            <div className="absolute bottom-0 left-2 right-2 flex justify-between py-2 bg-background-sh">
              <DayCardActions weekNumber={props.weekNumber} day={props.day} slots={props.slots} weekDays={props.weekDays} isRecurringDay={isRecurringDay} isRecurringSlotsOnly={props.isRecurringSlotsOnly} />
            </div>
          </>
        ) : (
          <>
            {isBeforeEndOfDay(props.day) ? (
              <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col p-3 justify-center items-center gap-2 mt-4">
                <Text variant="p-small-thin" className="w-full text-center text-muted-foreground text-balance">
                  There are no {props.isRecurringSlotsOnly && ' recurring '} slots created yet
                </Text>
                <Button onClick={props.isRecurringSlotsOnly ? handleAddRecurringSlot : handleAddSlot} size='sm' variant='outline'>
                  <Plus className="size-4 -ml-2 mr-1"/>
                  {props.isRecurringSlotsOnly ? "Add recurring slot" : "Add slot"}
                </Button>
              </div>
            ) : (
              <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col p-3 justify-center items-center gap-2 mt-4">
                <Text variant="p-small-thin" className="w-full text-center text-muted-foreground text-balance">There are no slots available.</Text>
              </div>
            )}
          </>
        )}
      </div>
      {/* Desktop breakpoint */}
      <div style={{ aspectRatio: "3/4" }} className="hidden xs:flex relative h-full col-span-1 flex-col border rounded-md border-border shadow-lg shadow-black bg-background-sh">
        <div className="w-full flex justify-between items-center p-3">
          <Text variant="p-base-thick" className={cn("mb-2", isBeforeEndOfDay(props.day) ? 'text-foreground' : 'text-muted-foreground')}>
            {getDayOfWeek(props.day)}
          </Text>
          <div className={cn(badgeVariant, "h-5 inline-flex items-center px-1.5 text-xs text-black font-semibold rounded-full shadow-black shadow-sm")}>
            {getDateOfMeeting(props.day)}
          </div>
        </div>
        <div className="h-full overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
          {filteredSlots.length > 0 ? (
            <div>
              <div className="w-full h-full flex flex-col gap-2 pt-2 pl-3 pr-2 mb-[72px]">
                {filteredSlots.map((s) => (
                  <TimeSlot key={s.id} slot={s} />
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between p-3 rounded-b-md bg-background-sh">
                <DayCardActions weekNumber={props.weekNumber} day={props.day} slots={props.slots} weekDays={props.weekDays} isRecurringDay={isRecurringDay} isRecurringSlotsOnly={props.isRecurringSlotsOnly} />
                <Button onClick={props.isRecurringSlotsOnly ? handleAddRecurringSlot : handleAddSlot} size='icon' className={cn('size-8', props.isRecurringSlotsOnly ? 'bg-teal-500 hover:bg-teal-500/90' : '')}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <>
              {isBeforeEndOfDay(props.day) ? (
                <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col p-3 justify-center items-center gap-2 mt-4">
                  <Text variant="p-small-thin" className="w-full text-center text-muted-foreground text-balance">
                    There are no {props.isRecurringSlotsOnly && ' recurring '} slots created yet
                  </Text>
                  <Button onClick={props.isRecurringSlotsOnly ? handleAddRecurringSlot : handleAddSlot} size="sm" variant="outline" className="bg-background-sh">
                    <Plus className="size-4 -ml-2 mr-1"/>
                    {props.isRecurringSlotsOnly ? "Add recurring slot" : "Add slot"}
                  </Button>
                </div>
              ) : (
                <Text variant="p-small-thin" className="w-full text-center text-muted-foreground text-balance absolute top-0 bottom-0 left-0 right-0 flex flex-col p-3 justify-center items-center gap-2 mt-4">There are no slots available.</Text>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}