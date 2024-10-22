"use client"

import { useMedia } from "react-use";
import { DayCard } from "@/components/scheduling/meetings/day-card";
import { Text } from "@/components/typography";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Meeting } from "@prisma/client";
import { usePathname } from "next/navigation";
import { getBadgeVariant } from "@/lib/scheduling";
import Link from "next/link";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDayOfWeek(day: string) {
  return DAYS_OF_WEEK[new Date(day).getDay()];
}
function getDateOfMeeting(day: string) {
  return `${String(new Date(day).getDate()).padStart(2, '0')}.${String(new Date(day).getMonth() + 1).padStart(2, '0')}`;
}
function getTimeOfMeeting(dateTime: Date) {
  return `${String(dateTime.getHours()).padStart(2, '0')}:${String(dateTime.getMinutes()).padStart(2, '0')}`;
}

type MeetingsSlots = { day: string, meetings: Meeting[] };

export function DayList(props: {
  weekNumber: number;
  weekMeetings: MeetingsSlots[];
  weekDays: string[];
}) {
  const pathname = usePathname();
  const week = pathname.split('/')[3];
  const day = pathname.split('/')[4];
  const badgeVariant = getBadgeVariant(props.weekNumber);
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
                     {getDayOfWeek(d.day)}
                   </Text>
                   <Text variant='p-small-thin' className={cn('leading-none', new Date() < new Date(`${d.day}T23:59:59.999Z`) ? 'text-foreground' : 'text-muted-foreground')}>
                     {getDateOfMeeting(d.day)}
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
        <div className="flex flex-col gap-4 mb-16">
          {props.weekNumber === 1 && (
            <>
              {emptyCards.map((card) => {
                return (
                  <div key={card} style={{ aspectRatio: '3/4' }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh" />
                )
              })}
            </>
          )}
          {props.weekMeetings
            .filter((d) => DAYS_OF_WEEK[new Date(d.day).getDay()] !== day.charAt(0).toUpperCase() + day.slice(1))
            .map((d) => {
              return (
                <Link key={d.day} href={`/scheduling/meetings-temp/${week}/${getDayOfWeek(d.day).charAt(0).toLowerCase() + getDayOfWeek(d.day).slice(1)}#meetings`} className={cn(d.meetings.length > 0 ? "hover:bg-secondary/70 hover:cursor-pointer" : "","min-h-[120px] w-full flex flex-col p-4 border border-border rounded-md shadow-lg bg-background-sh")}>
                  <div className="w-full flex justify-between mb-8">
                    <Text variant="p-base-thick">
                      {getDayOfWeek(d.day)}
                    </Text>
                    <div className={cn(badgeVariant, "h-5 inline-flex items-center px-1.5 text-xs text-black font-semibold rounded-full shadow-black shadow-sm")}>
                      {getDateOfMeeting(d.day)}
                    </div>
                  </div>
                  {d.meetings.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {d.meetings.map((m) => {
                        return (
                          <div key={m.id} className="flex justify-between">
                            <Text variant="p-small-thick" className="text-muted-foreground">
                              {m.userName}
                            </Text>
                            <Text variant="p-small-thick">
                              {getTimeOfMeeting(m.dateTime)}
                            </Text>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="relative h-[120px]">
                      <Text variant="p-small-thick" className="absolute top-1/3 -translate-y-1/2 left-1/2 -translate-x-1/2 text-center text-balance text-muted-foreground">
                        {`You don't have any meetings scheduled for ${getDayOfWeek(d.day)}`}
                      </Text>
                    </div>
                  )}
                </Link>
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