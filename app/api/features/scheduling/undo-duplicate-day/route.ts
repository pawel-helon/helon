import { db } from "@/lib/db";
import { getDayEnd, getDayStart } from "@/lib/helpers";
import { Slot } from "@prisma/client";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function POST(request: Request) {
  const { prevSlots }: { prevSlots: { day: string, slots: Slot[] }[] } = await request.json();
  if (!prevSlots) {
    return createResponse("Days and slots are required", 400);
  }

  try {
    // deleting all current slots from the selected days
    for (const day of prevSlots) {
      const deletingSlots = await db.slot.deleteMany({
        where: {
          dateTime: {
            gte: getDayStart(day.day),
            lte: getDayEnd(day.day),
          }
        }
      });
      if (!deletingSlots) {
        return createResponse("Failed to delete slots", 503);
      }
    }
    
    // restoring previous slots
    for (const day of prevSlots) {
      for (const slot of day.slots) {
        const duplicatingSlot = await db.slot.create({
          data: {
            dateTime: new Date(`${day.day}T${new Date(slot.dateTime).toISOString().split('T')[1]}`),
          }
        });
        if (!duplicatingSlot) {
          return createResponse("Failed to duplicate slots", 503);
        }
      }
    }
    return createResponse("Day has been duplicated", 201);
  } catch (error) {
    console.error(error);
    createResponse('An error occurred while duplicating day', 500);
  }
}