import { db } from "@/lib/db";
import { Slot } from "@prisma/client";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}
export async function POST(request: Request) {
  const { prevSlots }: { prevSlots: Slot[] } = await request.json();
  if (!prevSlots) {
    return createResponse("Slots are required", 400);
  }

  try {
    const restoringSlots = await db.slot.createMany({
      data: prevSlots
    });
    if (!restoringSlots) {
      return createResponse("Failed to restore slots", 503);
    }
    return createResponse("Slots have been restored", 201);
  } catch (error) {
    console.error(error);
    createResponse('An error occurred while restoring slots', 500);
  }
}