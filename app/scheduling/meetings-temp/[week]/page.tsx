import { redirect } from "next/navigation";
import { cache } from "react";

async function getWeek() {
  const today = new Date();
  const year = today.getFullYear();
  const dayOfWeek = today.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  const monday = new Date(today.setDate(today.getDate() + diffToMonday));
  const yearStart = new Date(monday.getFullYear(), 0 , 1);
  const weekNumber = Math.ceil((((monday.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { year, weekNumber };
}

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

const DAYS_OF_WEEK = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export default async function MeetingsPage() {
  const { year, weekNumber } = await getWeek();
  const weekDays = cachedWeekDays(year, weekNumber);
  const day = DAYS_OF_WEEK[new Date(weekDays[0]).getDay()];

  redirect(`/scheduling/meetings-temp/${year}-week-${weekNumber}/${day}`);
}
