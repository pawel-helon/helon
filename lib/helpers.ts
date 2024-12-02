import {
  checkRecurringDays,
  getMeetingsForWeek,
  getSlotsForWeek
} from "@/actions/server-actions";
import { Meeting, Slot, SLOTTYPE } from "@prisma/client";
import { DAYS_OF_WEEK, FEATURES_LINKS } from "./constants";
import { db } from "./db";

// layouts and pages

export async function getWeek() {
  const today = new Date();
  const year = today.getFullYear();
  const dayOfWeek = today.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  const monday = new Date(today.setDate(today.getDate() + diffToMonday));
  const yearStart = new Date(monday.getFullYear(), 0 , 1);
  const weekNumber = Math.ceil((((monday.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { year, weekNumber };
}

export function getYearAndWeek(string: string) {
  const year = Number(string.split('-')[0]);
  const weekNumber = Number(string.split('-')[2]);
  return { year, weekNumber }
}

export function getWeeks(year: number) {
  const yearStart = new Date(year, 0, 1).getDay();
  const yearEnd = new Date(year, 11, 31).getDay();
  let weekNumber: number = 0;
  let firstDay: string = '';
  let lastDay: string = '';
  const weeks: { weekNumber: number; firstDay: string; lastDay: string }[] = [];

  for (weekNumber = 1; weekNumber <= 53; weekNumber++) {
    if (weekNumber === 1) {
      firstDay = `${year}-01-01`;
      lastDay = `${year}-01-0${8 - yearStart}`;
      weeks.push({weekNumber, firstDay, lastDay});
    } else if (weekNumber === 53) {
      firstDay = `${year}-12-${31 - ( yearEnd - 1 )}`;
      lastDay = `${year}-12-31`;
      weeks.push({weekNumber, firstDay, lastDay});
    } else {
      const firstDayDate = new Date(year, 0, 1 + (weekNumber - 1) * 7 - (yearStart || 7) + 1);
      const lastDayDate = new Date(year, 0, 1 + (weekNumber - 1) * 7 - (yearStart || 7) + 7);
      firstDay = `${firstDayDate.getFullYear()}-${firstDayDate.getMonth() + 1}-${firstDayDate.getDate()}`;
      lastDay = `${lastDayDate.getFullYear()}-${lastDayDate.getMonth() + 1}-${lastDayDate.getDate()}`;
      weeks.push({weekNumber, firstDay, lastDay});
    }
  }
  return weeks;
}

export function getWeekDays(year: number, week: number) {
  if (week < 1 || week > 53 || year < new Date().getFullYear() || year > 2100) {
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
  return weekDays
};

export async function getWeekSlots(weekDays: string[]) {
  const gettingSlotsForWeek = await getSlotsForWeek(weekDays);
  const weekSlots = gettingSlotsForWeek.weekSlots as { day: string, slots: Slot[] }[];
  return weekSlots;
}

export async function getWeekMeeting(weekDays: string[]) {
  const gettingMeetingsForWeek = await getMeetingsForWeek(weekDays);
  const weekSlots = gettingMeetingsForWeek.weekMeetings as { day: string, meetings: Meeting[] }[];
  return weekSlots;
}

export async function getRecurringDays(weekDays: string[]) {
  const checkingRecurringDays = await checkRecurringDays(weekDays);
  const recurringDays = checkingRecurringDays.recurringDays as string[];
  return recurringDays;
}

export function getPrevNextWeeks(weekDays: string[], weekNumber: number) {
  const prevWeek = Array.from({ length: 7 }, (_, i) => new Date(new Date(weekDays[0]).setDate(new Date(weekDays[0]).getDate() + i - 7)).toISOString().split('T')[0]);
  const nextWeek = Array.from({ length: 7 }, (_, i) => new Date(new Date(weekDays[0]).setDate(new Date(weekDays[0]).getDate() + i + 7)).toISOString().split('T')[0]);
  const yearOnBackwardNavigation: number = new Date(prevWeek[0]).getFullYear();
  const yearOnForewardNavigation: number = new Date(nextWeek[nextWeek.length - 1]).getFullYear();

  let prevWeekNumber: number = weekNumber
  if (new Date(weekDays[0]).getFullYear() > new Date(prevWeek[prevWeek.length - 1]).getFullYear()) {
    prevWeekNumber = 53;
  } else {
    prevWeekNumber = weekNumber - 1;
  }

  let nextWeekNumber: number = weekNumber
  if (new Date(weekDays[weekDays.length - 1]).getFullYear() < new Date(nextWeek[prevWeek.length - 1]).getFullYear()) {
    nextWeekNumber = 1;
  } else {
    nextWeekNumber = weekNumber + 1;
  }
  return { prevWeekNumber, nextWeekNumber, yearOnBackwardNavigation, yearOnForewardNavigation };
}

export function getFilteredDay(weekDays: string[], day: string) {
  return weekDays.filter((d) => DAYS_OF_WEEK[new Date(d).getDay()].toLowerCase() === day)[0];
}

// other

export function getBadgeVariant(weekNumber: number) {
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

export function getDateRange(from: string, to: string) {
  const fromDate = `${String(new Date(from).getDate()).padStart(2, '0')}.${String(new Date(from).getMonth() + 1).padStart(2, '0')}`;
  const toDate = `${String(new Date(to).getDate()).padStart(2, '0')}.${String(new Date(to).getMonth() + 1).padStart(2, '0')}`;
  return `${fromDate} - ${toDate}`;
}

export function getPrevNextWeeksDateRanges(weeks: { weekNumber: number; firstDay: string; lastDay: string }[], weekNumber: number) {
  const week = weeks.filter(w => w.weekNumber === weekNumber);
  const firstDay = week[0].firstDay;
  const lastDay = week[0].lastDay;
  const fromDate = `${String(new Date(firstDay).getDate()).padStart(2, '0')}.${String(new Date(firstDay).getMonth() + 1).padStart(2, '0')}`;
  const toDate = `${String(new Date(lastDay).getDate()).padStart(2, '0')}.${String(new Date(lastDay).getMonth() + 1).padStart(2, '0')}`;
  return `${fromDate} - ${toDate}`;
}

export function getCurrentYear(date: string) {
  return new Date(date).getFullYear();
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function constructUrl(segments: string[], index: number) {
  return "/" + segments.slice(0, index + 1).join("/");
}

export function getDayOfWeek(day: string) {
  return DAYS_OF_WEEK[new Date(day).getDay()];
}

export function getDateOfMeeting(day: string | Date) {
  return `${String(new Date(day).getDate()).padStart(2, '0')}.${String(new Date(day).getMonth() + 1).padStart(2, '0')}`;
}

export function isBeforeEndOfDay(day: string | Date) {
  if (new Date() < new Date(`${day}T23:59:59.999Z`)) {
    return true
  } else {
    return false
  }
}

export function getEmptyCards(weekLength: number) {
  let emptyCards: number[] = [];
  let i: number = 0;
  for (i = 1; i <= 7 - weekLength; i++) {
    emptyCards.push(i);
  }
  return emptyCards;
}

export function getFilteredSlots(slots: Slot[], isRecurringSlotsOnly: boolean) {
  let result: Slot[] = [];
  if (isRecurringSlotsOnly) {
    result = slots
      .filter((s) => s.recurring === true && s.type !== SLOTTYPE.BOOKED)
  } else {
    result = slots
      .filter((s) => s.type !== SLOTTYPE.BOOKED)
  }
  return result;
}

export function getEmptyCheckboxes(weekLength: number) {
  let emptyCheckboxes: number[] = [];
  let i: number = 0;
  for (i = 1; i <= 7 - weekLength; i++) {
    emptyCheckboxes.push(i);
  }
  return emptyCheckboxes;
}

export function getSlotTime(dateTime: Date) {
  const hour = String(new Date(dateTime).getHours()).padStart(2, '0');
  const minute = String(new Date(dateTime).getMinutes()).padStart(2, '0');
  return { hour, minute };
}

export function getNameOfDay(day: string) {
  return DAYS_OF_WEEK[new Date(day).getDay()];
}

export function getDate(day: string) {
  return `${String(new Date(day).getDate()).padStart(2, "0")}.${String(new Date(day).getMonth() + 1).padStart(2, "0")}`;
}

export function getTimeOfMeeting(dateTime: Date) {
  return `${String(dateTime.getHours()).padStart(2, '0')}:${String(dateTime.getMinutes()).padStart(2, '0')}`;
}

export function getSegment(pathname: string, segment: number) {
  return pathname.split('/')[segment];
}

export function getNewSlotTime(date: Date) {
  return String(new Date(date).getHours()).padStart(2, "0") + ":" + String(new Date(date).getMinutes()).padStart(2, "0");
}

export function getNewSlotDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getDayStart(day: string) {
  return new Date(new Date(day).setHours(0,0,0,0));
}

export function getDayEnd(day: string) {
  return new Date(new Date(day).setHours(23,59,59,999));
}

export async function generateAvailableTimes(day: string): Promise<string> {
  const allTimes = [] as string[];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      allTimes.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  const existingSlots = await db.slot.findMany({
    where: {
      dateTime: {
        gte: getDayStart(day),
        lte: getDayEnd(day)
      }
    },
    select: {
      dateTime: true
    }
  });

  const unavailableTimes = [] as string[];
  for (const slot of existingSlots) {
    const time = String(new Date(slot.dateTime).getHours()).padStart(2, '0') + ':' + String(new Date(slot.dateTime).getMinutes()).padStart(2, '0');
    unavailableTimes.push(time);
  }
  
  const availableTimes = allTimes.filter((time) => !unavailableTimes.includes(time) && new Date(`${day}T${time}`) > new Date());
  return availableTimes[0] as string;
}

export async function generateRecurringDates(day: string | Date): Promise<Date[]> {
  const endOfYear = new Date(new Date(day).getFullYear(), 11, 31, 23, 59, 999);
  const currentRecurringDate = new Date(day);
  
  const recurringDates: Date[] = [];
  while (currentRecurringDate <= endOfYear) {
    recurringDates.push(new Date(currentRecurringDate));
    currentRecurringDate.setDate(currentRecurringDate.getDate() + 7);
  }
  
  return recurringDates;
}

export function getMeetingTitle(date: Date, userName: string) {
  return `${String(new Date(date).getHours()).padStart(2, '0')}:${String(new Date(date).getMinutes()).padStart(2, '0')} - ${userName}`;
}

export function getMeetingDate(date: string) {
  return `{${String(new Date(date).getDate()).padStart(2, '0')}.${String(new Date(date).getMonth() + 1).padStart(2, '0')}`;
}

export function getNextPrevFeaturesLinks(pathname: string) {
  let prevFeatureLink: string = '';
  let nextFeatureLink: string = '';
  let prevFeatureName: string = '';
  let nextFeatureName: string = '';
  
  const segments = pathname.split('/').filter(Boolean);
  const currentfeatureLink = `/${segments[0]}/${segments[1]}` ;
  const currentFeatureLinkIndex = FEATURES_LINKS.indexOf(currentfeatureLink);

  // getting links
  if (currentFeatureLinkIndex > 0) {
    prevFeatureLink = FEATURES_LINKS[currentFeatureLinkIndex - 1];
  } else {
    prevFeatureLink = FEATURES_LINKS[FEATURES_LINKS.length - 1];
  }

  if (currentFeatureLinkIndex < FEATURES_LINKS.length - 1 ) {
    nextFeatureLink = FEATURES_LINKS[currentFeatureLinkIndex + 1];
  } else {
    nextFeatureLink = FEATURES_LINKS[0];
  }

  // getting names
  if (prevFeatureLink !== '/features/qr-codes') {
    prevFeatureName = prevFeatureLink.split('/')[2].charAt(0).toLocaleUpperCase() + prevFeatureLink.split('/')[2].slice(1)
  } else {
    prevFeatureName = 'QR codes';
  }

  if (nextFeatureLink !== '/features/qr-codes') {
    nextFeatureName = nextFeatureLink.split('/')[2].charAt(0).toLocaleUpperCase() + nextFeatureLink.split('/')[2].slice(1)
  } else {
    nextFeatureName = 'QR codes';
  }
  
  return { prevFeatureLink, prevFeatureName, nextFeatureLink, nextFeatureName };
}