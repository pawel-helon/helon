"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMedia } from "react-use"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { getBadgeVariant } from "@/lib/scheduling"

type Week = { weekNumber: number; firstDay: string; lastDay: string };

export function Header(props: {
  weeks: Week[];
  weekNumber: number;
  weekDays: string[];
  prevWeekNumber: number;
  yearOnBackwardNavigation: number;
  nextWeekNumber: number;
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className={cn(badgeVariant, "min-w-[8rem] h-6 inline-flex justify-between items-center px-2.5 text-xs text-black font-semibold rounded-full shadow-black shadow-sm")}>
                  {`${String(new Date(props.weekDays[0]).getDate()).padStart(2, '0')}.${String(new Date(props.weekDays[0]).getMonth() + 1).padStart(2, '0')} - ${String(new Date(props.weekDays[props.weekDays.length - 1]).getDate()).padStart(2, '0')}.${String(new Date(props.weekDays[props.weekDays.length - 1]).getMonth() + 1).padStart(2, '0')}`}
                  <ChevronDown size={16} className="ml-2 -mr-1"/>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start" className="h-min flex flex-col bg-background-sh shadow-black shadow-sm">
                <div className="w-full max-h-[280px] flex flex-col pr-1 gap-0.5 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
                  {props.weeks.map((w) => {
                    const year = new Date(w.firstDay).getFullYear();
                    return (
                      <button key={w.weekNumber} onClick={() => router.push(`/scheduling/availability/${year}-week-${w.weekNumber}`)} className={cn(w.weekNumber === props.weekNumber ? "bg-accent" : "" ,"h-8 text-xs text-left px-1.5 py-2 rounded-md hover:bg-accent hover:text-accent-foreground")}>
                        {`${String(new Date(w.firstDay).getDate()).padStart(2, '0')}.${String(new Date(w.firstDay).getMonth() + 1).padStart(2, '0')} - ${String(new Date(w.lastDay).getDate()).padStart(2, '0')}.${String(new Date(w.lastDay).getMonth() + 1).padStart(2, '0')}`}
                      </button>
                    )
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex gap-2 items-center">
              <Link href={`/scheduling/availability/${props.yearOnBackwardNavigation}-week-${props.prevWeekNumber}`}>
                <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                  <ChevronLeft size={18}/>
                </Button>
              </Link>
              <Link href={`/scheduling/availability/${props.yearOnForewardNavigation}-week-${props.nextWeekNumber}`}>
                <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                  <ChevronRight size={18}/>
                </Button>
              </Link>
            </div>
          </div>
          <Text variant="h1">Scheduling</Text>
        </div>
      ) : (
        <div className="flex flex-col gap-2 my-[4rem]">
          <div className="flex gap-2 items-center">
            <Link href={`/scheduling/availability/${props.yearOnBackwardNavigation}-week-${props.prevWeekNumber}`}>
              <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                <ChevronLeft size={18}/>
              </Button>
            </Link>
            <Link href={`/scheduling/availability/${props.yearOnForewardNavigation}-week-${props.nextWeekNumber}`}>
              <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                <ChevronRight size={18}/>
              </Button>
            </Link>
          </div>
          <div className="flex items-start gap-2">
            <Text variant="h1">Scheduling</Text>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className={cn(badgeVariant, "min-w-[8rem] h-6 inline-flex justify-between items-center px-3 text-xs text-black font-semibold rounded-full shadow-black shadow-sm")}>
                  {`${String(new Date(props.weekDays[0]).getDate()).padStart(2, '0')}.${String(new Date(props.weekDays[0]).getMonth() + 1).padStart(2, '0')} - ${String(new Date(props.weekDays[props.weekDays.length - 1]).getDate()).padStart(2, '0')}.${String(new Date(props.weekDays[props.weekDays.length - 1]).getMonth() + 1).padStart(2, '0')}`}
                  <ChevronDown size={16} className="ml-2 -mr-1"/>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start" className="h-min flex flex-col bg-background-sh shadow-black shadow-sm">
                <div className="w-full max-h-[280px] flex flex-col pr-1 gap-0.5 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
                  {props.weeks.map((w) => {
                    const year = new Date(w.firstDay).getFullYear();
                    return (
                      <button key={w.weekNumber} onClick={() => router.push(`/scheduling/availability/${year}-week-${w.weekNumber}`)} className={cn(w.weekNumber === props.weekNumber ? "bg-accent" : "" ,"h-8 text-xs text-left px-1.5 py-2 rounded-md hover:bg-accent hover:text-accent-foreground")}>
                        {`${String(new Date(w.firstDay).getDate()).padStart(2, '0')}.${String(new Date(w.firstDay).getMonth() + 1).padStart(2, '0')} - ${String(new Date(w.lastDay).getDate()).padStart(2, '0')}.${String(new Date(w.lastDay).getMonth() + 1).padStart(2, '0')}`}
                      </button>
                    )
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </>
  )
}