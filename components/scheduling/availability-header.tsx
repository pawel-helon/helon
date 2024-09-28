import { Breadcrumbs } from "@/components/breadcrumbs";
import { Text } from "@/components/typography";
import Link from "next/link";
import { Navigation } from "./navigation";

export function AvailabilityHeader(props: { weekNumber: number, weekDays: string[] }) {
  return (
    <>
      <Breadcrumbs />
      <div className="flex flex-col gap-2 my-[4rem] xs:mb-[5rem]">
        <Navigation weekNumber={props.weekNumber} weekDays={props.weekDays} />
        <Text variant="h1">Scheduling</Text>
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