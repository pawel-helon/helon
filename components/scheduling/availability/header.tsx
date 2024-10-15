"use client"

import Link from "next/link"
import { useMedia } from "react-use"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Text } from "@/components/typography"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function getWeekBadgeVariant(weekNumber: number) {
  if (weekNumber > 11 && weekNumber < 25) {
    return "spring";
  } else if (weekNumber > 24 && weekNumber < 38) {
    return "summer";
  } else if (weekNumber > 37 && weekNumber < 51) {
    return "autumn";
  } else {
    return "winter";
  }
}

export function Header(props: {
  weekNumber: number;
  weekDays: string[];
  prevWeekNumber: number;
  yearOnBackwardNavigation: number;
  nextWeekNumber: number;
  yearOnForewardNavigation: number;
}) {
  const isMobile = useMedia("(max-width: 480px)", false);
  const weekBadgeVariant = getWeekBadgeVariant(props.weekNumber);

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col my-[4rem]">
          <div className="flex justify-between">
            <Badge variant={weekBadgeVariant} className="h-min">
              {`${String(new Date(props.weekDays[0]).getDate()).padStart(2, '0')}.${String(new Date(props.weekDays[0]).getMonth() + 1).padStart(2, '0')} - ${String(new Date(props.weekDays[props.weekDays.length - 1]).getDate()).padStart(2, '0')}.${String(new Date(props.weekDays[props.weekDays.length - 1]).getMonth() + 1).padStart(2, '0')}`}
            </Badge>
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
            <Badge variant={weekBadgeVariant}>
              {`${String(new Date(props.weekDays[0]).getDate()).padStart(2, '0')}.${String(new Date(props.weekDays[0]).getMonth() + 1).padStart(2, '0')} - ${String(new Date(props.weekDays[props.weekDays.length - 1]).getDate()).padStart(2, '0')}.${String(new Date(props.weekDays[props.weekDays.length - 1]).getMonth() + 1).padStart(2, '0')}`}
            </Badge>
          </div>
        </div>
      )}
    </>
  )
}