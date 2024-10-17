"use client"

import { useMemo, useState } from "react";
import { useMedia } from "react-use";
import { EllipsisVertical } from "lucide-react";
import { RemoveMeeting } from "@/components/scheduling/meetings/remove-meeting";
import { Text } from "@/components/typography";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Meeting } from "@prisma/client";
import { RescheduleMeeting } from "./reschedule.-meeting";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function DayCard(props: { 
  weekNumber: number;
  day: string;
  meetings: Meeting[];
 }) {
   const [openDropdown, setOpenDropdown] = useState<boolean>(false);
   const date = useMemo(() => new Date(props.day), [props.day]);
   const isMobile = useMedia("(max-width: 480px)", false)
  
  return (
    <>
      {isMobile ? (
        <div style={{ aspectRatio: "1" }} className="relative h-full col-span-1 flex flex-col bg-background-sh">
          <div className="h-full overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
            {props.meetings.length > 0 ? (
              <div className="w-full h-full flex flex-col gap-4 pt-2 pr-1">
                {props.meetings.map((m) => {
                  return (
                    <div key={m.id} className="flex justify-between gap-2">
                      <div className="flex grow gap-2">
                        <p className="h-8 grow text-nowrap overflow-hidden flex items-center rounded-md border border-input px-3 py-1 font-medium text-xs text-foreground shadow-sm">
                          {`${String(new Date(m.dateTime).getHours()).padStart(2, '0')}:${String(new Date(m.dateTime).getMinutes()).padStart(2, '0')} - ${m.userName}`}
                        </p>
                      </div>
                      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="outline" className="size-8">
                            <EllipsisVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={8} className="min-w-[6rem] flex flex-col bg-black shadow-black shadow-md p-1">
                          <RescheduleMeeting meetingId={m.id} userName={m.userName} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
                          <RemoveMeeting meetingId={m.id} userName={m.userName} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
                        </DropdownMenuContent>
                      </DropdownMenu>
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
      ) : (
        <div style={{ aspectRatio: '3/4' }} className="relative h-full col-span-1 flex flex-col border rounded-md border-border bg-background-sh">
          <div className="w-full flex justify-between items-center p-3">
            <Text variant='p-base-thick' className={cn('mb-2', new Date() < new Date(date.setHours(23,59,59,999)) ? 'text-foreground' : 'text-muted-foreground')}>
              {DAYS_OF_WEEK[date.getDay()]}
            </Text>
            <Text variant='p-base-thin' className={cn('mb-2', new Date() < new Date(date.setHours(23,59,59,999)) ? 'text-foreground' : 'text-muted-foreground')}>
              {String(date.getDate()).padStart(2, '0')}.{String(date.getMonth() + 1).padStart(2, '0')}
            </Text>
          </div>
          <div className="h-full overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
            {props.meetings.length > 0 ? (
              <div className="w-full h-full flex flex-col gap-4 pt-2 pl-3 pr-2">
                {props.meetings.map((m) => {
                  return (
                    <div key={m.id} className="flex justify-between gap-2">
                      <div className="flex grow gap-2">
                        <p className="h-8 grow text-nowrap overflow-hidden flex items-center rounded-md border border-input px-3 py-1 font-medium text-xs text-foreground shadow-sm">
                          {`${String(new Date(m.dateTime).getHours()).padStart(2, '0')}:${String(new Date(m.dateTime).getMinutes()).padStart(2, '0')} - ${m.userName}`}
                        </p>
                      </div>
                      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="outline" className="size-8 ml-2">
                            <EllipsisVertical size={16}/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={8} className="min-w-[6rem] flex flex-col bg-black shadow-black shadow-md p-1">
                          <RescheduleMeeting meetingId={m.id} userName={m.userName} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
                          <RemoveMeeting meetingId={m.id} userName={m.userName} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
                        </DropdownMenuContent>
                      </DropdownMenu>
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
      )}
    </>
  )
} 