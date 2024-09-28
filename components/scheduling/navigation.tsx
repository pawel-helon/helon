'use client'

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { Text } from "../typography"
import { useRouter } from "next/navigation";

export function Navigation(props: { weekNumber: number, weekDays: string[] }) {
  const router = useRouter();
  
  return (
    <div className="flex gap-2 items-center">
      <Button onClick={() => router.push(`/scheduling/availability/week-${props.weekNumber - 1}`)} size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
        <ChevronLeft size={18}/>
      </Button>
      <Button onClick={() => router.push(`/scheduling/availability/week-${props.weekNumber + 1}`)} size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
        <ChevronRight size={18}/>
      </Button>
      <Text variant="p-small-thin" className="text-foreground">
        {`${String(new Date(props.weekDays[0]).getDate()).padStart(2, '0')} - ${String(new Date(props.weekDays[6]).getDate()).padStart(2, '0')} ${new Date(props.weekDays[6]).toLocaleString('default', { month: 'long' })} ${new Date(props.weekDays[6]).getFullYear()}`}
      </Text>
    </div>
  )
}