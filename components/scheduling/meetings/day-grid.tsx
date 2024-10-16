"use client"

import { useMedia } from "react-use";
import { DayCard } from "@/components/scheduling/meetings/day-card";
import { Text } from "@/components/typography";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Meeting } from "@prisma/client";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type MeetingsSlots = { day: string, meetings: Meeting[] };

export function DayGrid(props: {
  weekNumber: number;
  weekMeetings: MeetingsSlots[];
  weekDays: string[];
}) {
  const isMobile = useMedia("(max-width: 480px)", false);
  
  const emptyCards: number[] = [];
  let i: number = 0;
  for (i = 1; i <= 7 - props.weekDays.length; i++) {
    emptyCards.push(i);
  }

  return (
    <>
      {isMobile ? (
        <Accordion type="single" defaultValue={props.weekDays[0]}>
         {props.weekMeetings.map((d) => {
           return (
             <AccordionItem key={d.day} value={d.day}>
               <AccordionTrigger className="hover:no-underline">
                 <div className="flex items-end gap-2">
                   <Text variant='p-base-thick' className={cn('leading-none', new Date() < new Date(`${d.day}T23:59:59.999Z`) ? 'text-foreground' : 'text-muted-foreground')}>
                     {DAYS_OF_WEEK[new Date(d.day).getDay()]}
                   </Text>
                   <Text variant='p-small-thin' className={cn('leading-none', new Date() < new Date(`${d.day}T23:59:59.999Z`) ? 'text-foreground' : 'text-muted-foreground')}>
                     {String(new Date(d.day).getDate()).padStart(2, '0')}.{String(new Date(d.day).getMonth() + 1).padStart(2, '0')}
                   </Text>
                 </div>
               </AccordionTrigger>
               <AccordionContent>
                <DayCard key={d.day} weekNumber={props.weekNumber} day={d.day} meetings={d.meetings}/>
               </AccordionContent>
             </AccordionItem>
           )
         })}
       </Accordion>
      ) : (
        <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-4 mb-16'>
          {props.weekNumber === 1 && (
            <>
              {emptyCards.map((card) => {
                return (
                  <div key={card} style={{ aspectRatio: '3/4' }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh" />
                )
              })}
            </>
          )}
          {props.weekMeetings.map((d) => {
            return (
              <DayCard key={d.day} weekNumber={props.weekNumber} day={d.day} meetings={d.meetings}/>
            )
          })}
          {props.weekNumber === 53 && (
            <>
              {emptyCards.map((card) => {
                return (
                  <div key={card} style={{ aspectRatio: '3/4' }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh" />
                )
              })}
            </>
          )}
        </div>
      )}
    </>
  )
}