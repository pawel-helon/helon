"use client"

import { Meeting } from "@prisma/client";
import { DayCard } from "@/components/scheduling/meetings/day-card";

type MeetingsSlots = { day: string, meetings: Meeting[] };

export function DayGrid(props: {
  weekNumber: number;
  weekMeetings: MeetingsSlots[];
  weekDays: string[];
}) {

  
  const emptyCards: number[] = [];
  let i: number = 0;
  for (i = 1; i <= 7 - props.weekDays.length; i++) {
    emptyCards.push(i);
  }

  return (
    <>
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
    </>
  )
}