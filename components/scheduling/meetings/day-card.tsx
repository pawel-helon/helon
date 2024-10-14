"use client"

import { cn } from "@/lib/utils";
import { Meeting } from "@prisma/client";
import { Text } from "@/components/typography";
import { useMemo } from "react";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function DayCard(props: { 
  weekNumber: number;
  day: string;
  meetings: Meeting[];
 }) {
  const date = useMemo(() => new Date(props.day), [props.day]);
  
  return (
    <div style={{ aspectRatio: '3/4' }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh">
      <div className="w-full flex justify-between items-center p-3">
        <Text variant='p-base-thick' className={cn('mb-2', new Date() < new Date(date.setHours(23,59,59,999)) ? 'text-foreground' : 'text-muted-foreground')}>
          {DAYS_OF_WEEK[date.getDay()]}
        </Text>
        <Text variant='p-small-thin' className={cn('mb-2', new Date() < new Date(date.setHours(23,59,59,999)) ? 'text-foreground' : 'text-muted-foreground')}>
          {String(date.getDate()).padStart(2, '0')}.{String(date.getMonth() + 1).padStart(2, '0')}
        </Text>
      </div>
      <div className="h-full overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
        {props.meetings.length > 0 ? (
          <div className='w-full h-full flex flex-col gap-4 pt-2 pl-3 pr-2'>
            {props.meetings.map((m) => {
              return (
                <div key={m.id} className={cn(new Date() > new Date(m.dateTime) ? "opacity-50" : "", "w-full flex justify-between pb-2 border-b border-border")}>
                  <Text variant='p-base-thick' className="text-xs">{m.userName}</Text>
                  <Text variant='p-base-thick' className="text-xs">
                    {String(new Date(m.dateTime).getHours()).padStart(2, '0')}:
                    {String(new Date(m.dateTime).getMinutes()).padStart(2, '0')}
                  </Text>
                </div>
              )
            })}
          </div>
        ) : (
          <div className='absolute top-0 bottom-0 left-0 right-0 flex flex-col p-3 justify-center items-center gap-2 mt-4'>
            <Text variant='p-small-thin' className='w-full text-center text-muted-foreground text-balance'>
              There are no meetings scheduled
            </Text>
          </div>
        )}
      </div>
    </div>
  )
} 