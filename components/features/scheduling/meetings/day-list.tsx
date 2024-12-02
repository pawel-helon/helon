"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { capitalizeFirstLetter, getBadgeVariant, getDateOfMeeting, getEmptyCards, getNameOfDay, getSegment, getTimeOfMeeting, isBeforeEndOfDay } from "@/lib/helpers";
import { DayCard } from "@/components/features/scheduling/meetings/day-card";
import { Text } from "@/components/typography";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Meeting } from "@prisma/client";
import { cn } from "@/lib/utils";

export function DayList(props: {
  weekNumber: number;
  weekMeetings: { day: string, meetings: Meeting[] }[];
  weekDays: string[];
}) {
  const pathname = usePathname();
  const badgeVariant = getBadgeVariant(props.weekNumber);
  const emptyCards = getEmptyCards(props.weekDays.length) as number[];
  
  return (
    <>
      <div className="block xs:hidden">
        <Accordion type="single" defaultValue={props.weekDays[0]}>
         {props.weekMeetings.map((d) => (
            <AccordionItem key={d.day} value={d.day}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-end gap-2">
                  <Text variant='p-base-thick' className={cn('leading-none', isBeforeEndOfDay(d.day) ? 'text-foreground' : 'text-muted-foreground')}>
                    {getNameOfDay(d.day)}
                  </Text>
                  <Text variant='p-small-thin' className={cn('leading-none', isBeforeEndOfDay(d.day) ? 'text-foreground' : 'text-muted-foreground')}>
                    {getDateOfMeeting(d.day)}
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
      <div className="hidden xs:flex flex-col gap-4 mb-16">
        {props.weekNumber === 1 && (
          <>
            {emptyCards.map((card) => (
              <div key={card} style={{ aspectRatio: '3/4' }} className="relative h-full col-span-1 flex flex-col rounded-md border border-border shadow-black shadow-lg bg-background-sh" />
            ))}
          </>
        )}
        {props.weekMeetings
          .filter((d) => getNameOfDay(d.day) !== capitalizeFirstLetter(getSegment(pathname, 4)))
          .map((d) => (
            <Link key={d.day} href={`/features/scheduling/meetings/${getSegment(pathname, 3)}/${getNameOfDay(d.day).toLowerCase()}#meetings`} className="hover:bg-background-sh-hover hover:cursor-pointer min-h-[120px] w-full flex flex-col p-4 animation duration-200 transition-colors border border-border rounded-md shadow-black shadow-lg bg-background-sh">
              <div className="w-full flex justify-between mb-8">
                <Text variant="p-base-thick">
                  {getNameOfDay(d.day)}
                </Text>
                <div className={cn(badgeVariant, "h-5 inline-flex items-center px-1.5 text-xs text-black font-semibold rounded-full shadow-black shadow-sm")}>
                  {getDateOfMeeting(d.day)}
                </div>
              </div>
              {d.meetings.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {d.meetings.map((m) => (
                    <div key={m.id} className="flex justify-between">
                      <Text variant="p-small-thick" className="text-muted-foreground">
                        {m.userName}
                      </Text>
                      <Text variant="p-small-thick">
                        {getTimeOfMeeting(m.dateTime)}
                      </Text>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative h-[120px]">
                  <Text variant="p-small-thick" className="absolute top-1/3 -translate-y-1/2 left-1/2 -translate-x-1/2 text-center text-balance text-muted-foreground">
                    {`You don't have any meetings scheduled on ${getNameOfDay(d.day)}`}
                  </Text>
                </div>
              )}
            </Link>
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