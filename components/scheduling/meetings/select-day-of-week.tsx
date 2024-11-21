"use client"

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Text } from "@/components/typography";

function getDayOfWeek(day: string) {
  const DAYS_OF_WEEK = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return DAYS_OF_WEEK[new Date(day).getDay()];
}
function getWeekDay(day: string) {
  return `${String(new Date(day).getDate()).padStart(2, "0")}.${String(new Date(day).getMonth() + 1).padStart(2, "0")}`;
}
function capitalizeFirstLetter(string: string ) {
  const formattedString = string.charAt(0).toUpperCase() + string.slice(1);
  return formattedString;
}

export function SelectDayOfWeek(props: {
  year: number;
  weekNumber: number;
  weekDays: string[];
}) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean)
  const day = segments[segments.length - 1]
  const isMobile = useMedia("(max-width: 480px)", false);

  function handleChangeDay(d: string) {
    setDropdownOpen(!dropdownOpen)
    router.push(`/scheduling/meetings/${props.year}-week-${props.weekNumber}/${getDayOfWeek(d)}`);
  }
  
  if (!isMobile) return null;
  
  return (
    <div role="menu" className="w-full flex justify-end mb-4">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger>
          <div className="min-w-[9rem] h-8 inline-flex items-center justify-between px-3 text-xs text-foreground font-semibold border border-border rounded-full shadow-black shadow-sm">
            {capitalizeFirstLetter(segments[segments.length - 1])}
            <ChevronDown size={16} className="ml-2 -mr-1"/>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" sideOffset={8} align="end" className="min-w-[9rem] h-min flex flex-col bg-background-sh shadow-black shadow-sm">
          {props.weekDays.filter((d) => getDayOfWeek(d) !== day).map((d) => (
            <button 
              key={d}
              role="option"
              aria-selected={false}
              onClick={() => handleChangeDay(d)}
              className="h-8 flex justify-between text-xs text-right px-1.5 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <Text variant="p-small-thick">{capitalizeFirstLetter(getDayOfWeek(d))}</Text>
              <Text variant="p-small-thin" className="text-foreground">{getWeekDay(d)}</Text>
            </button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}