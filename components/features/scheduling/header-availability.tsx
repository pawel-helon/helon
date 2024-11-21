"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMedia } from "react-use"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Text } from "@/components/typography"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const getBadgeVariant = (weekNumber: number) => {
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

function getDateRange(from: string, to: string) {
  const fromDate = `${String(new Date(from).getDate()).padStart(2, '0')}.${String(new Date(from).getMonth() + 1).padStart(2, '0')}`;
  const toDate = `${String(new Date(to).getDate()).padStart(2, '0')}.${String(new Date(to).getMonth() + 1).padStart(2, '0')}`;
  return `${fromDate} - ${toDate}`;
}

function getPrevNextWeeksDateRanges(weeks: Week[], weekNumber: number) {
  const week = weeks.filter(w => w.weekNumber === weekNumber);
  const firstDay = week[0].firstDay;
  const lastDay = week[0].lastDay;
  const fromDate = `${String(new Date(firstDay).getDate()).padStart(2, '0')}.${String(new Date(firstDay).getMonth() + 1).padStart(2, '0')}`;
  const toDate = `${String(new Date(lastDay).getDate()).padStart(2, '0')}.${String(new Date(lastDay).getMonth() + 1).padStart(2, '0')}`;
  return `${fromDate} - ${toDate}`;
}

function getCurrentYear(date: string) {
  return new Date(date).getFullYear();
}

type Week = { weekNumber: number; firstDay: string; lastDay: string };

export function Header(props: {
  weeks: Week[];
  weekNumber: number;
  weekDays: string[];
  prevWeekNumber: number;
  prevWeekDays: string[];
  yearOnBackwardNavigation: number;
  nextWeekNumber: number;
  nextWeekDays: string[];
  yearOnForewardNavigation: number;
}) {
  const isMobile = useMedia("(max-width: 480px)", false);
  const router = useRouter();
  const badgeVariant = getBadgeVariant(props.weekNumber);

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col my-[4rem]">
          <div className="flex justify-between">
            <div role="menu" aria-label="Change week">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className={cn(badgeVariant, "min-w-[8rem] h-6 inline-flex justify-between items-center px-2.5 text-xs text-black font-semibold rounded-full shadow-black shadow-sm")}>
                    {getDateRange(props.weekDays[0], props.weekDays[props.weekDays.length - 1])}
                    <ChevronDown size={16} className="ml-2 -mr-1"/>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start" className="h-min flex flex-col bg-background-sh shadow-black shadow-sm">
                  <div className="w-full max-h-[280px] flex flex-col pr-1 gap-0.5 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
                    {props.weeks.map((w) => (
                      <button
                        key={w.weekNumber}
                        role="option"
                        aria-selected={false}
                        onClick={() => router.push(`/features/scheduling/availability/${getCurrentYear(w.firstDay)}-week-${w.weekNumber}`)}
                        className={cn(w.weekNumber === props.weekNumber ? "bg-accent" : "" ,"h-8 text-xs text-left px-1.5 py-2 rounded-md hover:bg-accent hover:text-accent-foreground")}
                      >
                        {getDateRange(w.firstDay, w.lastDay)}
                      </button>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <nav className="flex gap-2 items-center">
              <Link href={`/features/scheduling/availability/${props.yearOnBackwardNavigation}-week-${props.prevWeekNumber}`}>
                <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                  <ChevronLeft size={18}/>
                </Button>
              </Link>
              <Link href={`/features/scheduling/availability/${props.yearOnForewardNavigation}-week-${props.nextWeekNumber}`}>
                <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                  <ChevronRight size={18}/>
                </Button>
              </Link>
            </nav>
          </div>
          <Text variant="h1">Scheduling</Text>
        </div>
      ) : (
        <div className="flex flex-col gap-2 my-[4rem]">
          <nav className="flex gap-2 items-center">
            <div role="tooltip" aria-label={`Go to ${getPrevNextWeeksDateRanges(props.weeks, props.prevWeekNumber)} week`}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/features/scheduling/availability/${props.yearOnBackwardNavigation}-week-${props.prevWeekNumber}`}>
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
            </div>
            <div role="tooltip" aria-label={`Go to ${getPrevNextWeeksDateRanges(props.weeks, props.nextWeekNumber)} week`}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/features/scheduling/availability/${props.yearOnForewardNavigation}-week-${props.nextWeekNumber}`}>
                      <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                        <ChevronRight size={18}/>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={16} align="start" className="text-xs rounded-full">
                    {getPrevNextWeeksDateRanges(props.weeks, props.nextWeekNumber)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </nav>
          <div className="flex items-start gap-2">
            <Text variant="h1">Scheduling</Text>
            <div role="menu" aria-label="Change week">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className={cn(badgeVariant, "min-w-[8rem] h-6 inline-flex justify-between items-center px-3 text-xs text-black font-semibold rounded-full shadow-black shadow-sm")}>
                    {getDateRange(props.weekDays[0], props.weekDays[props.weekDays.length - 1])}
                    <ChevronDown size={16} className="ml-2 -mr-1"/>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start" className="h-min flex flex-col bg-background-sh shadow-black shadow-sm">
                  <div className="w-full max-h-[280px] flex flex-col pr-1 gap-0.5 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
                    {props.weeks.map((w) => (
                      <button
                        key={w.weekNumber}
                        role="option"
                        aria-selected={false}
                        onClick={() => router.push(`/features/scheduling/availability/${getCurrentYear(w.firstDay)}-week-${w.weekNumber}`)}
                        className={cn(w.weekNumber === props.weekNumber ? "bg-accent" : "" ,"h-8 text-xs text-left px-1.5 py-2 rounded-md hover:bg-accent hover:text-accent-foreground")}
                      >
                        {getDateRange(w.firstDay, w.lastDay)}
                      </button>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
    </>
  )
}