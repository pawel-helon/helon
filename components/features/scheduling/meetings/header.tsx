"use client"

import Link from "next/link"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { getCurrentYear, getDateRange, getPrevNextWeeksDateRanges } from "@/lib/helpers"
import { Text } from "@/components/typography"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function getBadgeVariant(weekNumber: number) {
  if (weekNumber > 11 && weekNumber < 25) {
    return "bg-gradient-to-r from-green-500/85 to-green-600/85";
  } else if (weekNumber > 24 && weekNumber < 38) {
    return "bg-gradient-to-r from-yellow-400 to-yellow-500";
  } else if (weekNumber > 37 && weekNumber < 51) {
    return "bg-gradient-to-r from-orange-500/90 to-orange-600/90";
  } else {
    return "bg-gradient-to-r from-stone-300 to-stone-400";
  }
}

export function Header(props: {
  weeks: { weekNumber: number; firstDay: string; lastDay: string }[];
  weekNumber: number;
  weekDays: string[];
  prevWeekNumber: number;
  yearOnBackwardNavigation: number;
  nextWeekNumber: number;
  yearOnForewardNavigation: number;
}) {
  return (
    <>
      {/* Mobile breakpoint */}
      <div className="flex xs:hidden flex-col my-[4rem]">
        <div className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className={cn(getBadgeVariant(props.weekNumber), "min-w-[8rem] h-6 inline-flex items-center justify-between px-2.5 text-xs text-black font-semibold rounded-full shadow-black shadow-sm")}>
                {getDateRange(props.weekDays[0], props.weekDays[props.weekDays.length - 1])}
                <ChevronDown size={16} className="ml-2 -mr-1"/>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="h-min flex flex-col bg-background-sh shadow-black shadow-sm">
              <div className="w-full max-h-[280px] flex flex-col pr-1 gap-0.5 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
                {props.weeks.map((w) => (
                  <Link key={w.weekNumber} href={`/features/scheduling/meetings/${getCurrentYear(w.firstDay)}-week-${w.weekNumber}/monday`} className={cn(w.weekNumber === props.weekNumber ? "bg-accent" : "" ,"h-8 text-xs text-left px-1.5 py-2 rounded-md hover:bg-accent hover:text-accent-foreground")}>
                    {getDateRange(w.firstDay, w.lastDay)}
                  </Link>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex gap-2 items-center">
            <Link href={`/features/scheduling/meetings/${props.yearOnBackwardNavigation}-week-${props.prevWeekNumber}/monday`}>
              <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                <ChevronLeft size={18}/>
              </Button>
            </Link>
            <Link href={`/features/scheduling/meetings/${props.yearOnForewardNavigation}-week-${props.nextWeekNumber}/monday`}>
              <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                <ChevronRight size={18}/>
              </Button>
            </Link>
          </div>
        </div>
        <Text variant="h1">Scheduling</Text>
      </div>
      {/* Desktop breakpoint */}
      <div className="hidden xs:flex flex-col gap-2 my-[4rem]">
        <div className="flex gap-2 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/features/scheduling/meetings/${props.yearOnBackwardNavigation}-week-${props.prevWeekNumber}/monday`}>
                  <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                    <ChevronLeft size={18}/>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={16} align="start" className="text-xs rounded-full">
                {getPrevNextWeeksDateRanges(props.weeks, props.prevWeekNumber)}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/features/scheduling/meetings/${props.yearOnForewardNavigation}-week-${props.nextWeekNumber}/monday`}>
                  <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                    <ChevronRight size={18}/>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={16} align="start" className="text-xs rounded-full">
                {getPrevNextWeeksDateRanges(props.weeks, props.prevWeekNumber)}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-start gap-2">
          <Text variant="h1">Scheduling</Text>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className={cn(getBadgeVariant(props.weekNumber), "min-w-[8rem] h-6 inline-flex justify-between items-center px-3 text-xs text-black font-semibold rounded-full shadow-black shadow-sm")}>
                {getDateRange(props.weekDays[0], props.weekDays[props.weekDays.length - 1])}
                <ChevronDown size={16} className="ml-2 -mr-1"/>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="h-min flex flex-col shadow-black shadow-sm bg-background-sh">
              <div className="w-full max-h-[280px] flex flex-col pr-1 gap-0.5 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
                {props.weeks.map((w) => (
                  <Link key={w.weekNumber} href={`/features/scheduling/meetings/${getCurrentYear(w.firstDay)}-week-${w.weekNumber}/monday`} className={cn(w.weekNumber === props.weekNumber ? "bg-accent" : "" ,"h-8 text-xs text-left px-1.5 py-2 rounded-md hover:bg-accent hover:text-accent-foreground")}>
                    {getDateRange(w.firstDay, w.lastDay)}
                  </Link>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}