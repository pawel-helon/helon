import { db } from "@/lib/db";
import { getDayEnd, getDayStart } from "@/lib/helpers";
import { Slot } from "@prisma/client";

function createResponse(message: string, status: number, prevSlots?: Slot[]) {
  return new Response(JSON.stringify({ message, status, prevSlots }));
}

export async function DELETE(request: Request) {
  const { day }: {day: string} = await request.json();
  if (!day) {
    return createResponse("Day is required", 400);
  }
  try {
    // Storing all current slots for the given day
    const currentSlots = await db.slot.findMany({
      where: {
        dateTime: {
          gte: getDayStart(day),
          lte: getDayEnd(day),
        }
      }
    })

    // Deleting all slots for the given day
    const deletingSlots = await db.slot.deleteMany({
      where: {
        dateTime: {
          gte: getDayStart(day),
          lte: getDayEnd(day),
        }
      }
    });

    if (!deletingSlots) {
      return createResponse("Failed to delete slots", 503);
    }
    return createResponse("Slots have been deleted", 204, currentSlots);
  } catch (error) {
    console.error(error);
    createResponse('An error occurred while deleting slots', 500);
  }
}