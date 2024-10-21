import { cache } from "react";
import { getDayMeetings } from "@/actions/server-actions";
import { RemoveMeeting } from "@/components/scheduling/meetings/remove-meeting";
import { RescheduleMeeting } from "@/components/scheduling/meetings/reschedule-meeting";
import { Text } from "@/components/typography";
import { Label } from "@/components/ui/label";
import { Meeting } from "@prisma/client";

const DAYS_OF_WEEK = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const cachedWeekDays = cache((year: number, week: number) => {
  if (week < 1 || week > 53 || year < 2020 || year > 2100) {
    throw new Error;
  }
  const yearStart = new Date(year, 0, 1).getDay();
  const yearEnd = new Date(year, 11, 31).getDay();
  let i: number = 0;
  let weekDay: string = '';
  let weekDays: string[] = [];
  
  if (week === 1) {
    if (yearStart > 0) {
      for (i = yearStart; i <= 7; i++) {
        weekDay = `${year}-01-0${i - yearStart + 1}`;
        weekDays.push(weekDay);
      }
    } else {
      weekDay = `${year}-01-01`;
      weekDays.push(weekDay);
    }
  } else if (week === 53) {
    if (yearEnd > 0) {
      for (i = 31 - ( yearEnd - 1 ); i <= 31; i++) {
        weekDay = `${year}-12-${i}`;
        weekDays.push(weekDay);
      }
    } else {
      weekDay = `${year}-12-31`;
      weekDays.push(weekDay);
    }
  } else {
    const firstWeekday = new Date(year, 0, 1 + (week - 1) * 7 - (yearStart || 7) + 1);
    weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(firstWeekday);
      date.setDate(firstWeekday.getDate() + i);
      return `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    });
  }
  return weekDays;
});


export default async function MeetingsWeekDayPage(props: {
  params: { week: string; day: string }
}) {
  const year = Number(props.params.week.split('-')[0]);
  const weekNumber = Number(props.params.week.split('-')[2]);
  const weekDays = cachedWeekDays(year, weekNumber);
  const day = weekDays.filter((d) => DAYS_OF_WEEK[new Date(d).getDay()] === props.params.day);
  const gettingDayMeetings = await getDayMeetings(day[0]);
  const meetings = gettingDayMeetings.meetings as Meeting[];

  return (
    <div className="flex flex-col gap-4 mb-16">
      {meetings.length > 0 ? (
        <>
          {meetings.map((m) => {
            return (
              <div key={m.id} className="w-full flex flex-col p-4 border border-border rounded-md shadow-lg bg-background-sh">
                <div className="w-full flex justify-between mb-8">
                  <Text variant="p-base-thick">
                    {`${m.userName} at ${String(m.dateTime.getHours()).padStart(2, '0')}:${String(m.dateTime.getMinutes()).padStart(2, '0')}`}
                  </Text>
                  <Text variant="p-base-thin" className="text-foreground-h">
                    {`${m.dateTime.getDate()}.${m.dateTime.getMonth() + 1}`}
                  </Text>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-muted-foreground">Phone number</Label>
                      <div className="flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        {m.userPhoneNumber}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="overflow-hidden text-muted-foreground">Email</Label>
                      <div className="flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        {m.userEmail}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 flex flex-col">
                    <div className="grow flex flex-col gap-2">
                      <Label className="text-muted-foreground">Message</Label>
                      <div className="flex grow w-full rounded-md border border-input bg-transparent p-3 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        {m.message || ''}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-end gap-2 mt-8">
                  <RemoveMeeting meetingId={m.id} userName={m.userName} />
                  <RescheduleMeeting meetingId={m.id} userName={m.userName} />
                </div>
              </div>
            )
          })}
        </>
      ) : (
        <div className="relative h-[400px] flex p-4 border border-border rounded-md shadow-lg bg-background-sh">
          <Text variant="p-small-thick" className="text-center text-balance text-muted-foreground absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            {`You don't have any meetings scheduled for ${props.params.day.charAt(0).toUpperCase() + props.params.day.slice(1)}`}
          </Text>
        </div>
      )}
    </div>
  )
}