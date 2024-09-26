import { db } from "@/lib/db";
import { SLOTTYPE } from "@prisma/client";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status}));
}

export async function POST() {
  const dateTimes = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    date.setHours(8 + i);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  });
  
  try {
    const slots = await db.slot.findMany({
      where: { type: SLOTTYPE.AVAILABLE },
    });
    
    if (!slots) {
      return createResponse("Slots not found", 503);
    }

    if (slots.length === 0) {
      const newSlots = await db.slot.createMany({
        data: dateTimes.map(dateTime => ({ dateTime, type: SLOTTYPE.AVAILABLE })),
      })
      if (!newSlots) {
        return createResponse("Failed to create slots", 503);
      } else {
        return createResponse("Added sample slots", 201);
      }
    } else {
      return createResponse("Slots already exist", 200);
    }
  } catch (error) {
    return createResponse("An unexpected error has occurred", 500);
  }
}
