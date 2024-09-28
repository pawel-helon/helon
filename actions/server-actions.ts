"use server"

import { db } from "@/lib/db";
import { Slot } from "@prisma/client";

export async function getSlotsForWeek(week: string[]) {
  const weekSlots = [] as {day: string, slots: Slot[]}[]

  for (const day of week) {
    const slots = await db.slot.findMany({
      where: {
        dateTime: {
          gte: new Date(`${day}T00:00:00.000Z`),
          lte: new Date(`${day}T23:59:59.999Z`)
        },
      },
      orderBy: {
        dateTime: "asc" 
      }
    }) as Slot[];
    weekSlots.push({day, slots})
  }
  if (!weekSlots) {
    return { message: "No slots fetched", status: 404 };
  } else {  
  return { message: "Slots fetched", status: 200, weekSlots };
  }
}

export async function updateSlotHour(slotId: string, dateTime: Date, hour: string) {
  const slot = await db.slot.update({
    where: {
      id: slotId,
    },
    data: {
      dateTime: new Date(dateTime.setHours(Number(hour)))
    }
  });

  if (!slot) {
    return { message: "Slot not updated", status: 404 };
  } else {
    return { message: "Slot updated", status: 200 };
  }
}

export async function updateSlotMinutes(slotId: string, dateTime: Date, minutes: string) {
  const slot = await db.slot.update({
    where: {
      id: slotId,
    },
    data: {
      dateTime: new Date(dateTime.setMinutes(Number(minutes)))
    }
  });

  if (!slot) {
    return { message: "Slot not updated", status: 404 };
  } else {
    return { message: "Slot updated", status: 200 };
  }
}

export async function addSlot(day: string) {
  const allTimes = [] as string[];
  for (let hour = 6; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      allTimes.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  const unavailableTimes = [] as string[];
  const slots = await db.slot.findMany({
    where: {
      dateTime: {
        gte: new Date(`${day}T00:00:00.000Z`),
        lte: new Date(`${day}T23:59:59.999Z`)
      },
    },
    select: {
      dateTime: true
    }
  }) as Slot[];
  for (const slot of slots) {
    unavailableTimes.push(slot.dateTime.toISOString().split('T')[1].slice(0, 5));
  }
  
  const availableTimes = allTimes.filter(time => !unavailableTimes.includes(time));

  const newSlot = await db.slot.create({
    data: {
      dateTime: new Date(`${day}T${availableTimes[0]}:00.000Z`),
    }
  })

  if (!newSlot) {
    return { message: "Slot not created", status: 404 };
  } else {
    return { message: "Slot created", status: 201 };
  }
}

export async function deleteSlot(slotId: string) {
  const slot = await db.slot.delete({
    where: {
      id: slotId,
    }
  });

  if (!slot) {
    return { message: "Slot not deleted", status: 404 };
  } else {
    return { message: "Slot deleted", status: 202 };
  }
}


export async function duplicateSlots(dayToDuplicate: string, slotsForDuplicating: Slot[]) {
  const slots = await db.slot.deleteMany({
    where: {
      dateTime: {
        gte: `${dayToDuplicate}T00:00:00.000Z`,
        lte: `${dayToDuplicate}T23:59:59.999Z`
      },
    },
  });

  if (!slots) {
    return { message: "No slots duplicated", status: 404 };
  } else {
    for (const slot of slotsForDuplicating) {
      const time = slot.dateTime.toISOString().split('T')[1];
      await db.slot.create({
        data: {
          dateTime: `${dayToDuplicate}T${time}`
        }
      });
    }
    return { message: "Slots duplicated", status: 201 };
  }
}