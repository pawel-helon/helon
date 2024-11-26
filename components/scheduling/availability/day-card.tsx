"use client"

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMedia } from "react-use";
import { Plus } from "lucide-react";
import { addSlot, addRecurringSlot } from "@/actions/database-actions";
import { TimeSlot } from "@/components/scheduling/availability/time-slot";
import { DayCardActions } from "@/components/scheduling/availability/day-card-actions";
import { Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slot, SLOTTYPE } from "@prisma/client";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const getBadgeVariant = (weekNumber: number) => {
  if (weekNumber > 11 && weekNumber < 25) {
    return "bg-gradient-to-r from-green-500/85 to-green-600/85";
  } else if (weekNumber > 24 && weekNumber < 38) {
    return "bg-gradient-to-r from-yellow-400 to-yellow-500";
  } else if (weekNumber > 37 && weekNumber < 51) {
    return "bg-gradient-to-r from-orange-500/90 to-orange-600/90";
  } else {
    return "bg-gradient-to-r from-stone-300 to-stone-400";
  }
}

function isBeforeEndOfTheDay(day: string) {
  let result: boolean;
  new Date() <= new Date(new Date(day).setHours(19, 59, 59, 999)) ? result = true : result = false;
  return result;
}

function getDateOfMeeting(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}
function getDayOfWeek(date: Date) {
  return DAYS_OF_WEEK[date.getDay()];
}

function gettingNewSlot(day: string, slots: Slot[]) {
  const allTimes = [] as string[];
  let newTime: string = '';
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      allTimes.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  
  if (slots.length === 0) {
    if (new Date(day).getDate() === new Date().getDate() && new Date() < new Date(new Date().setHours(19,59,59,999))) {
      const currentHour = String(new Date().getHours()).padStart(2, '0');
      const currentMinuutes = String(new Date().getMinutes()).padStart(2, '0');
      const time = allTimes.filter(slot => new Date(`${day}T${slot}:00.000Z`) > new Date(`${day}T${currentHour}:${currentMinuutes}:00.000Z`))[0];
      newTime = time;
    } else {
      newTime = '08:00'
    }
  }
  else {
    const currentLastSlot = slots[slots.length - 1];
    const currentLastSlotHour = String(new Date(currentLastSlot.dateTime).getHours()).padStart(2, '0');
    const currentLastSlotMinutes = String(new Date(currentLastSlot.dateTime).getMinutes()).padStart(2, '0');
    const currentLastSlotIndex = allTimes.indexOf(`${currentLastSlotHour}:${currentLastSlotMinutes}`);
    const time = allTimes[currentLastSlotIndex + 1];
    newTime = time;
  }
  return { id: 'temp', type: SLOTTYPE.AVAILABLE, dateTime: new Date(`${day}T${newTime}:00.000Z`), recurring: false, createdAt: new Date(), updatedAt: new Date() }
}

export function DayCard(props: {
  weekNumber: number;
  day: string;
  data: Slot[];
  isRecurringSlotsOnly: boolean;
  weekDays: string[];
  recurringDays: string[];
}) {
  const [slots, setSlots] = useState<Slot[]>(props.data);
  const router = useRouter();
  const date = useMemo(() => new Date(props.day), [props.day]);
  const isRecurringDay = props.recurringDays.includes(props.day);
  const daysExceptToday = props.weekDays.filter(d => d !== props.day);
  const filteredSlots = props.isRecurringSlotsOnly ? slots.filter((s) => s.recurring === true && s.type !== SLOTTYPE.BOOKED) : slots.filter((s) => s.type !== SLOTTYPE.BOOKED);
  const badgeVariant = getBadgeVariant(props.weekNumber);
  const isMobile = useMedia("(max-width: 480px)", false);
  const newSlot = gettingNewSlot(props.day, slots);

  async function handleAddSlot() {
    setSlots(prev => [...prev, newSlot])
    try {
      const result = await addSlot(props.day);
      if (result.status !== 201) {
        toast.error(result.message);
        setSlots(props.data);
        return;
      }
      setSlots(prev => prev.map(slot => slot.id === 'temp' ? result.slot! : slot));
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
      {isMobile ? (
        <div role="gridcell" style={{ aspectRatio: "1" }} className="relative h-full col-span-1 flex flex-col bg-background-sh">
          {filteredSlots.length > 0 ? (
            <>
              <div className="w-full flex flex-col gap-2 pt-2 pl-2 pr-3 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
                {filteredSlots.map((s) => (
                  <TimeSlot key={s.id} slot={s} daysExceptToday={daysExceptToday} />
                ))}
              </div>
              <div className="absolute bottom-0 left-2 right-2 flex justify-between py-2 bg-background-sh">
                <DayCardActions weekNumber={props.weekNumber} day={props.day} slots={slots} weekDays={props.weekDays} isRecurringDay={isRecurringDay} isRecurringSlotsOnly={props.isRecurringSlotsOnly} />
              </div>
            </>
          ) : (
            <>
              {isBeforeEndOfTheDay(props.day) ? (
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
      ) : (
        <div role="gridcell" style={{ aspectRatio: "3/4" }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border shadow-lg shadow-black bg-background-sh">
          <div className="w-full flex justify-between items-center p-3">
            <Text variant="p-base-thick" className={cn("mb-2", new Date() < new Date(`${props.day}T23:59:59.999Z`) ? 'text-foreground' : 'text-muted-foreground')}>
              {getDayOfWeek(date)}
            </Text>
            <div id={`day-availability-card-${getDateOfMeeting(date)}`} className={cn(badgeVariant, "h-5 inline-flex items-center px-1.5 text-xs text-black font-semibold rounded-full shadow-black shadow-sm")}>
              {getDateOfMeeting(date)}
            </div>
          </div>
          <div aria-labelledby={`day-availability-card-${getDateOfMeeting(date)}`} className="h-full overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
            {filteredSlots.length > 0 ? (
              <div>
                <div className="w-full h-full flex flex-col gap-2 pt-2 pl-3 pr-2 mb-[72px]">
                  {filteredSlots.map((s) => (
                    <TimeSlot key={s.id} slot={s} daysExceptToday={daysExceptToday} />
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between p-3 rounded-b-md bg-background-sh">
                  <DayCardActions weekNumber={props.weekNumber} day={props.day} slots={slots} weekDays={props.weekDays} isRecurringDay={isRecurringDay} isRecurringSlotsOnly={props.isRecurringSlotsOnly} />
                  <Button
                    aria-label={props.isRecurringSlotsOnly ? "Add recurring slot" : "Add slot"}
                    onClick={props.isRecurringSlotsOnly ? handleAddRecurringSlot : handleAddSlot}
                    size='icon'
                    className={cn('size-8', props.isRecurringSlotsOnly ? 'bg-teal-500 hover:bg-teal-500/90' : '')}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {isBeforeEndOfTheDay(props.day) ? (
                  <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col p-3 justify-center items-center gap-2 mt-4">
                    <Text variant="p-small-thin" className="w-full text-center text-muted-foreground text-balance">
                      There are no {props.isRecurringSlotsOnly && ' recurring '} slots created yet
                    </Text>
                    <Button
                      aria-label={props.isRecurringSlotsOnly ? "Add recurring slot" : "Add slot"}
                      onClick={props.isRecurringSlotsOnly ? handleAddRecurringSlot : handleAddSlot}
                      size="sm"
                      variant="outline"
                      className="bg-background-sh"
                    >
                      <Plus className="size-4 -ml-2 mr-1"/>
                      {props.isRecurringSlotsOnly ? "Add recurring slot" : "Add slot"}
                    </Button>
                  </div>
                ) : (
                  <Text variant="p-small-thin" className="w-full text-center text-muted-foreground text-balance absolute top-0 bottom-0 left-0 right-0 flex flex-col p-3 justify-center items-center gap-2 mt-4">
                    There are no slots available.
                  </Text>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}