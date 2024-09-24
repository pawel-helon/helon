"use server"

import { db } from "@/lib/db";
import { Slot } from "@prisma/client";

export async function getSlotsForCurrentWeek(currentWeek: string[]) {
  const currentWeekSlots = [] as {day: string, slots: Slot[]}[]

  for (const day of currentWeek) {
    const slots = await db.slot.findMany({
      where: {
        dateTime: {
          gte: new Date(`${day}T00:00:00.000Z`),
          lte: new Date(`${day}T23:59:59.999Z`)
        },
      },
    }) as Slot[];
    currentWeekSlots.push({day, slots})
  }
  return currentWeekSlots;
}