"use client"

import { Meeting } from "@prisma/client";

type MeetingsSlots = { day: string, meetings: Meeting[] };

export function DayGrid(props: {
  weekMeetings: MeetingsSlots[];
  weekDays: string[];
}) {

  return (
    <>
      <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-4 mb-16'>
        {props.weekMeetings.map((d) => {
          return (
            <div key={d.day}/>
          )
        })}
      </div>
    </>
  )
}