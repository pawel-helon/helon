"use client"

import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { getMeetingDate, getMeetingTitle, getNameOfDay, isBeforeEndOfDay } from "@/lib/helpers";
import { Text } from "@/components/typography";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Meeting } from "@prisma/client";

export function DayCard(props: { 
  weekNumber: number;
  day: string;
  meetings: Meeting[];
 }) {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  
  return (
    <>
        {/* Mobile breakpoint */}
        <div style={{ aspectRatio: "1" }} className="flex xs:hidden relative h-full col-span-1 flex-col bg-background-sh">
          <div className="h-full overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
            {props.meetings.length > 0 ? (
              <div className="w-full h-full flex flex-col gap-4 pt-2 pr-1">
                {props.meetings.map((m) => (
                  <div key={m.id} className="flex justify-between gap-2">
                    <div className="flex grow gap-2">
                      <p className="h-8 grow text-nowrap overflow-hidden flex items-center rounded-md border border-input px-3 py-1 font-medium text-xs text-foreground shadow-sm">
                        {getMeetingTitle(m.dateTime, m.userName)}
                      </p>
                    </div>
                    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline" className="size-8">
                          <EllipsisVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" sideOffset={8} className="min-w-[6rem] flex flex-col bg-black shadow-black shadow-sm p-1">
                        
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
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
        {/* Desktop breakpoint */}
        <div style={{ aspectRatio: '3/4' }} className="hidden xs:flex relative h-full col-span-1 flex-col border border-border rounded-md shadow-md bg-background-sh">
          <div className="w-full flex justify-between items-center p-3">
            <Text variant='p-base-thick' className={cn('mb-2', isBeforeEndOfDay(props.day) ? 'text-foreground' : 'text-muted-foreground')}>
              {getNameOfDay(props.day)}
            </Text>
            <Text variant='p-base-thin' className={cn('mb-2', isBeforeEndOfDay(props.day) ? 'text-foreground' : 'text-muted-foreground')}>
              {getMeetingDate(props.day)}
            </Text>
          </div>
          <div className="h-full overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
            {props.meetings.length > 0 ? (
              <div className="w-full h-full flex flex-col gap-4 pt-2 pl-3 pr-2">
                {props.meetings.map((m) => (
                  <div key={m.id} className="flex justify-between gap-2">
                    <div className="flex grow gap-2">
                      <p className="h-8 grow text-nowrap overflow-hidden flex items-center rounded-md border border-input px-3 py-1 font-medium text-xs text-foreground shadow-sm">
                        {getMeetingTitle(m.dateTime, m.userName)}
                      </p>
                    </div>
                    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline" className="size-8 ml-2">
                          <EllipsisVertical size={16}/>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" sideOffset={8} className="min-w-[6rem] flex flex-col bg-black shadow-black shadow-sm p-1">
                        
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
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
    </>
  )
} 