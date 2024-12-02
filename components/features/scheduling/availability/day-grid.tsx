"use client"

import { useEffect, useState } from "react";
import { deletePastSlots } from "@/actions/database-actions";
import { getBadgeVariant, getDateOfMeeting, getDayOfWeek, getEmptyCards, isBeforeEndOfDay } from "@/lib/helpers";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DayCard } from "@/components/features/scheduling/availability/day-card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import { Slot } from "@prisma/client";

export function DayGrid(props: {
  slots: { day: string, slots: Slot[] }[];
  weekNumber: number;
  weekDays: string[];
  recurringDays: string[];
}) {
  const [isRecurringSlotsOnly, setIsRecurringSlotsOnly] = useState<boolean>(false);
  const badgeVariant = getBadgeVariant(props.weekNumber);
  const emptyCards = getEmptyCards(props.weekDays.length);
  
  useEffect(() => {
    async function initDeletePastSlots() {
      try {
        deletePastSlots();
      } catch (error) {
        console.error(error);
      }
    }
    initDeletePastSlots();
  })
  
  return (
    <div role="tabpanel">
      {/* Mobile breakpoint */}
      <main className="block xs:hidden">
        <div role="toolbar" className="w-full flex justify-end items-center gap-2 mb-4">
          <Label htmlFor="only-recurring" className="text-xs text-muted-foreground">Recurring only</Label>
          <Switch checked={isRecurringSlotsOnly} onCheckedChange={() => setIsRecurringSlotsOnly(!isRecurringSlotsOnly)} className="data-[state=checked]:bg-teal-500" />
        </div>
        <Accordion type="single" defaultValue={props.weekDays[0]} className="flex flex-col gap-4">
          {props.slots.map((day) => (
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
                <DayCard
                  key={day.day} 
                  weekNumber={props.weekNumber} 
                  day={day.day} 
                  slots={day.slots}
                  isRecurringSlotsOnly={isRecurringSlotsOnly} 
                  weekDays={props.weekDays} 
                  recurringDays={props.recurringDays!}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      {/* Desktop breakpoint */}
      <main className="hidden xs:block">
        <div role="toolbar" className="w-full flex justify-end items-center gap-2 mb-4">
          <Label htmlFor='only-recurring' className='text-xs text-muted-foreground'>Recurring only</Label>
          <Switch checked={isRecurringSlotsOnly} onCheckedChange={() => setIsRecurringSlotsOnly(!isRecurringSlotsOnly)} className="data-[state=checked]:bg-teal-500"/>
        </div>
        <div role="grid" className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-4 mb-16">
          {props.weekNumber === 1 && (
            <>
              {emptyCards.map((card) => (
                <div key={card} style={{ aspectRatio: "3/4" }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh" />
              ))}
            </>
          )}
          {props.slots.map((day) => (
            <DayCard 
              key={day.day} 
              weekNumber={props.weekNumber} 
              day={day.day} 
              slots={day.slots}
              isRecurringSlotsOnly={isRecurringSlotsOnly} 
              weekDays={props.weekDays} 
              recurringDays={props.recurringDays!}
            />
          ))}
          {props.weekNumber === 53 && (
            <>
              {emptyCards.map((card) => (
                <div key={card} style={{ aspectRatio: "3/4" }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh" />
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  )
}