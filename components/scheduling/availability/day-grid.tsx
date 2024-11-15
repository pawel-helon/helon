"use client"

import { useEffect, useState } from "react";
import { useMedia } from "react-use";
import { deletePastSlots } from "@/actions/database-actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slot } from "@prisma/client";
import { DayCard } from "@/components/scheduling/availability/day-card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDayOfWeek(day: string) {
  return DAYS_OF_WEEK[new Date(day).getDay()];
}
function getDateOfMeeting(day: string) {
  return `${String(new Date(day).getDate()).padStart(2, '0')}.${String(new Date(day).getMonth() + 1).padStart(2, '0')}`;
}
function isBeforeEndOfDay(day: string) {
  if (new Date() < new Date(`${day}T23:59:59.999Z`)) {
    return true
  } else {
    return false
  }
}

function getBadgeVariant(weekNumber: number) {
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

type DaySlots = { day: string, slots: Slot[] };

export function DayGrid(props: {
  slotsForWeek: DaySlots[];
  weekNumber: number;
  weekDays: string[];
  recurringDays: string[];
}) {
  const isMobile = useMedia("(max-width: 480px)", false);
  const [isRecurringSlotsOnly, setIsRecurringSlotsOnly] = useState<boolean>(false);
  const badgeVariant = getBadgeVariant(props.weekNumber);
  
  useEffect(() => {
    async function initDeletePastSlots() {
      try {
        await deletePastSlots();
      } catch (error) {
        console.error(error);
      }
    }
    initDeletePastSlots();
  })

  const emptyCards: number[] = [];
  let i: number = 0;
  for (i = 1; i <= 7 - props.weekDays.length; i++) {
    emptyCards.push(i);
  }
  
  return (
    <>
      {isMobile ? (
        <>
          <div className="w-full flex justify-end items-center gap-2 mb-4">
            <Label htmlFor="only-recurring" className="text-xs text-muted-foreground">Recurring only</Label>
            <Switch checked={isRecurringSlotsOnly} onCheckedChange={() => setIsRecurringSlotsOnly(!isRecurringSlotsOnly)} className="data-[state=checked]:bg-teal-500" />
          </div>
          <Accordion type="single" defaultValue={props.weekDays[0]} className="flex flex-col gap-4">
            {props.slotsForWeek.map((day) => (
              <AccordionItem key={day.day} value={day.day} className="border border-border rounded-md shadow-lg shadow-black">
                <AccordionTrigger className="px-2 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className={cn(badgeVariant, "h-5 w-fit inline-flex items-center px-1.5 text-xs text-black font-semibold rounded-full shadow-black shadow-sm")}>
                      {getDateOfMeeting(day.day)}
                    </div>
                    <Text variant="p-base-thick" className={cn("leading-none", isBeforeEndOfDay(day.day) ? "text-foreground" : "text-muted-foreground")}>
                      {getDayOfWeek(day.day)}
                    </Text>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <DayCard key={day.day} weekNumber={props.weekNumber} day={day.day} slots={day.slots} isRecurringSlotsOnly={isRecurringSlotsOnly} weekDays={props.weekDays} recurringDays={props.recurringDays}/>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      ) : (
        <>
          <div className="w-full flex justify-end items-center gap-2 mb-4">
            <Label htmlFor='only-recurring' className='text-xs text-muted-foreground'>Recurring only</Label>
            <Switch checked={isRecurringSlotsOnly} onCheckedChange={() => setIsRecurringSlotsOnly(!isRecurringSlotsOnly)} className="data-[state=checked]:bg-teal-500"/>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-4 mb-16">
            {props.weekNumber === 1 && (
              <>
                {emptyCards.map((card) => {
                  return (
                    <div key={card} style={{ aspectRatio: "3/4" }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh" />
                  )
                })}
              </>
            )}
            {props.slotsForWeek.map((day) => {
              return (
                <DayCard key={day.day} weekNumber={props.weekNumber} day={day.day} slots={day.slots} isRecurringSlotsOnly={isRecurringSlotsOnly} weekDays={props.weekDays} recurringDays={props.recurringDays}/>
              )
            })}
            {props.weekNumber === 53 && (
              <>
                {emptyCards.map((card) => {
                  return (
                    <div key={card} style={{ aspectRatio: "3/4" }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh" />
                  )
                })}
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}