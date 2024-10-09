import { db } from "@/lib/db";
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
          gte: new Date(new Date(day).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(day).setHours(23, 59, 59, 999)),
        }
      }
    })

    // Deleting all slots for the given day
    const deletingSlots = await db.slot.deleteMany({
      where: {
        dateTime: {
          gte: new Date(new Date(day).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(day).setHours(23, 59, 59, 999)),
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