import { db } from "@/lib/db";
import { Slot } from "@prisma/client";

function createResponse(message: string, status: number, prevSlots?: { day: string, slots: Slot[] }[]) {
  return new Response(JSON.stringify({ message, status, prevSlots }));
}

export async function POST(request: Request) {
  const { days, slots }: {days: string[], slots: Slot[]} = await request.json();
  if (!days || !slots) {
    return createResponse("Days and slots are required", 400);
  }

  const filteredDays = days.filter(day => new Date() <= new Date(day));

  try {
    // storing all current slots from the selected days
    const currentSlots: { day: string, slots: Slot[] }[] = [];
    for (const day of filteredDays) {
      const slots = await db.slot.findMany({
        where: {
          dateTime: {
            gte: new Date(`${day}T00:00:00.000Z`),
            lte: new Date(`${day}T23:59:59.999Z`),
          }
        }
      }) as Slot[];
      if (!slots) {
        return createResponse("Failed to get slots", 503);
      }
      currentSlots.push({ day, slots });
    }

    // deleting all current slots from the selected days
    for (const day of filteredDays) {
      const deletingSlots = await db.slot.deleteMany({
        where: {
          dateTime: {
            gte: new Date(`${day}T00:00:00.000Z`),
            lte: new Date(`${day}T23:59:59.999Z`),
          }
        }
      });
      if (!deletingSlots) {
        return createResponse("Failed to delete slots", 503);
      }
    }
    
    // duplicating slots from chosen day.
    for (const day of filteredDays) {
      for (const slot of slots) {
        const duplicatingSlot = await db.slot.create({
          data: {
            dateTime: new Date(`${day}T${new Date(slot.dateTime).toISOString().split('T')[1]}`),
          }
        });
        if (!duplicatingSlot) {
          return createResponse("Failed to duplicate slots", 503);
        }
      }
    }
    return createResponse("Day has been duplicated", 201, currentSlots);
  } catch (error) {
    console.error(error);
    createResponse('An error occurred while duplicating day', 500);
  }
}