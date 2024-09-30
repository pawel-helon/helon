import { Breadcrumbs } from "@/components/breadcrumbs";
import { Text } from "@/components/typography";
import Link from "next/link";
import { Navigation } from "@/components/scheduling/navigation";
import { Badge } from "@/components/ui/badge";

export function AvailabilityHeader(props: { weekNumber: number, weekDays: string[] }) {
  let badgeVariant = "spring" as | "spring" | "summer" | "autumn" | "winter";

  if (props.weekNumber > 11 && props.weekNumber < 25) {
    badgeVariant = "spring";
  } else if (props.weekNumber > 24 && props.weekNumber < 38) {
    badgeVariant = "summer";
  } else if (props.weekNumber > 37 && props.weekNumber < 51) {
    badgeVariant = "autumn";
  } else {
    badgeVariant = "winter";
  }
  
  return (
    <>
      <Breadcrumbs />
      <div className="flex flex-col gap-2 my-[4rem] xs:mb-[5rem]">
        <Navigation weekNumber={props.weekNumber} weekDays={props.weekDays} />
        <div className="flex items-start gap-2">
          <Text variant="h1">Scheduling</Text>
          <Badge variant={badgeVariant}>
            {`${String(new Date(props.weekDays[0]).getDate()).padStart(2, '0')}.${String(new Date(props.weekDays[0]).getMonth() + 1).padStart(2, '0')} - ${String(new Date(props.weekDays[6]).getDate()).padStart(2, '0')}.${String(new Date(props.weekDays[6]).getMonth() + 1).padStart(2, '0')}`}
          </Badge>
        </div>
      </div>
      <div className="h-11 mb-8 flex border-b border-border">
        <Link href='/scheduling/meetings' prefetch={true} className='inline-flex items-center justify-center whitespace-nowrap rounded-none px-3 py-1 text-sm font-medium hover:cursor-pointer ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 text-muted-foreground shadow border-b border-muted-foreground'>
          Meetings
        </Link>
        <Link href='/scheduling/availability' prefetch={true} className='inline-flex items-center justify-center whitespace-nowrap rounded-none px-3 py-1 text-sm font-medium hover:cursor-pointer ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 text-primary shadow border-b border-primary'>
          Availability
        </Link>
      </div>
    </>
  )
}