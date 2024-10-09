import { db } from "@/lib/db";
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
            gte: new Date(new Date(day.day).setHours(0,0,0,0)),
            lte: new Date(new Date(day.day).setHours(23,59,59,999)),
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