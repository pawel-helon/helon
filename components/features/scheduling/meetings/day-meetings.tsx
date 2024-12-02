"use client"

import { Text } from "@/components/typography";
import { Accordion, AccordionContent, AccordionTrigger, AccordionItem } from "@/components/ui/accordion";
import { RemoveMeeting } from "@/components/features/scheduling/meetings/remove-meeting";
import { getBadgeVariant, getDateOfMeeting, getDayOfWeek, getTimeOfMeeting, isBeforeEndOfDay } from "@/lib/helpers";
import { RescheduleMeetingMobile } from "@/components/features/scheduling/meetings/reschedule-meeting-mobile";
import { RescheduleMeetingDesktop } from "@/components/features/scheduling/meetings/reschedule-meeting-desktop";
import { cn } from "@/lib/utils";
import { Meeting } from "@prisma/client";

export function DayMeetings(props: { weekNumber: number, day: string, meetings: Meeting[]}) {
  const badgeVariant = getBadgeVariant(props.weekNumber)

  return (
    <>
      <div className="block xs:hidden mb-16">
        {props.meetings.length > 0 ? (
          <Accordion type="single" defaultValue={props.meetings[0].id} className="flex flex-col gap-4">
            {props.meetings.map((m) => (
              <AccordionItem key={m.id} value={m.id} className="border border-border rounded-sm shadow-lg shadow-black bg-background-sh">
                <AccordionTrigger className="px-2 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="h-5 inline-flex items-center px-1.5 text-xs text-black font-semibold rounded-full border border-border shadow-black shadow-sm bg-gradient-to-r from-stone-300 to-stone-400">
                      {getTimeOfMeeting(m.dateTime)}
                    </div>
                    <Text variant='p-base-thick' className={cn('leading-none', isBeforeEndOfDay(props.day) ? 'text-foreground' : 'text-muted-foreground')}>
                      {m.userName}
                    </Text>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0 px-2 flex flex-col gap-4">
                  <div className="flex flex-col gap-2 mt-4">
                    <Text variant="p-small-thick" className="text-muted-foreground">Phone number</Text>
                    <Text variant="p-small-thick" className="w-full h-9 flex items-center rounded-md border border-input bg-transparent px-3 py-1 shadow-sm">{m.userPhoneNumber}</Text>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Text variant="p-small-thick" className="text-muted-foreground">Email</Text>
                    <Text variant="p-small-thick" className="w-full h-9 flex items-center rounded-md border border-input bg-transparent px-3 py-1 shadow-sm">{m.userEmail}</Text>
                  </div>
                  <div className="grow flex flex-col gap-2">
                    <Text variant="p-small-thick" className="text-muted-foreground">Message</Text>
                    <div className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent p-3 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                      {m.message || ''}
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-2 my-2">
                    <RemoveMeeting meetingId={m.id} userName={m.userName} />
                    <RescheduleMeetingMobile meetingId={m.id} userName={m.userName} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="relative h-[320px] flex p-4 border border-border rounded-md shadow-black shadow-lg bg-background-sh">
            <Text variant="p-small-thick" className="text-center text-balance text-muted-foreground absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              {`You don't have any meetings scheduled on ${getDayOfWeek(props.day)}`}
            </Text>
          </div>
        )}
      </div>
      <div className="hidden xs:flex flex-col gap-4 mb-16">
        {props.meetings.length > 0 ? (
          <>
            {props.meetings.map((m) => (
                <div key={m.id} className="w-full flex flex-col p-4 border border-border rounded-md shadow-black shadow-lg bg-background-sh">
                  <div className="w-full flex justify-between mb-8">
                    <Text variant="p-base-thick">{m.userName}</Text>
                    <div className={cn(badgeVariant, "h-5 inline-flex items-center px-1.5 text-xs text-black font-semibold rounded-full shadow-black shadow-sm")}>
                      {getDateOfMeeting(m.dateTime)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1 flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Text variant="p-small-thick" className="text-muted-foreground">Time</Text>
                        <Text variant="p-small-thick" className="w-full h-9 flex items-center rounded-md border border-input bg-transparent px-3 py-1 shadow-sm">{getTimeOfMeeting(m.dateTime)}</Text>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Text variant="p-small-thick" className="text-muted-foreground">Phone number</Text>
                        <Text variant="p-small-thick" className="w-full h-9 flex items-center rounded-md border border-input bg-transparent px-3 py-1 shadow-sm">{m.userPhoneNumber}</Text>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Text variant="p-small-thick" className="text-muted-foreground">Email</Text>
                        <Text variant="p-small-thick" className="w-full h-9 flex items-center rounded-md border border-input bg-transparent px-3 py-1 shadow-sm">{m.userEmail}</Text>
                      </div>
                    </div>
                    <div className="col-span-1 flex flex-col">
                      <div className="grow flex flex-col gap-2">
                        <Text variant="p-small-thick" className="text-muted-foreground">Message</Text>
                        <div className="flex grow w-full rounded-md border border-input bg-transparent p-3 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                          {m.message || ''}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-end gap-2 mt-8">
                    <RemoveMeeting meetingId={m.id} userName={m.userName} />
                    <RescheduleMeetingDesktop meetingId={m.id} userName={m.userName} />
                  </div>
                </div>
            ))}
          </>
        ) : (
          <div className="relative h-[400px] flex p-4 border border-border rounded-md shadow-black shadow-lg bg-background-sh">
            <Text variant="p-small-thick" className="text-center text-balance text-muted-foreground absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              {`You don't have any meetings scheduled on ${getDayOfWeek(props.day)}`}
            </Text>
          </div>
        )}
      </div>
    </>
  )
}