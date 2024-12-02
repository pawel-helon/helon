"use client"

import { getEmptyCards, getMeetingDate, getNameOfDay, isBeforeEndOfDay } from "@/lib/helpers";
import { DayCard } from "@/components/features/scheduling/meetings/day-card";
import { Text } from "@/components/typography";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Meeting } from "@prisma/client";

export function DayGrid(props: {
  weekNumber: number;
  weekMeetings: { day: string, meetings: Meeting[] }[];
  weekDays: string[];
}) {
  const emptyCards = getEmptyCards(props.weekDays.length);

  return (
    <>
      <div className="hidden xs:block" >
        <Accordion type="single" defaultValue={props.weekDays[0]}>
         {props.weekMeetings.map((d) => (
            <AccordionItem key={d.day} value={d.day}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-end gap-2">
                  <Text variant='p-base-thick' className={cn('leading-none', isBeforeEndOfDay(d.day) ? 'text-foreground' : 'text-muted-foreground')}>
                  {getNameOfDay(d.day)}
                  </Text>
                  <Text variant='p-small-thin' className={cn('leading-none', isBeforeEndOfDay(d.day) ? 'text-foreground' : 'text-muted-foreground')}>
                  {getMeetingDate(d.day)}
                  </Text>
                </div>
              </AccordionTrigger>
              <AccordionContent>
              <DayCard key={d.day} weekNumber={props.weekNumber} day={d.day} meetings={d.meetings}/>
              </AccordionContent>
            </AccordionItem>
          ))}
       </Accordion>
      </div>
      <div className='hidden xs:grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-4 mb-16'>
        {props.weekNumber === 1 && (
          <>
            {emptyCards.map((card) => (
              <div key={card} style={{ aspectRatio: '3/4' }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh" />
            ))}
          </>
        )}
        {props.weekMeetings.map((d) => (
          <DayCard key={d.day} weekNumber={props.weekNumber} day={d.day} meetings={d.meetings}/>
        ))}
        {props.weekNumber === 53 && (
          <>
            {emptyCards.map((card) => (
              <div key={card} style={{ aspectRatio: '3/4' }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh" />
            ))}
          </>
        )}
      </div>
    </>
  )
}