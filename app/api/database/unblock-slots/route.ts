import { db } from "@/lib/db";
import { SLOTTYPE } from "@prisma/client";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function GET() {
  try {
    const oneHourAgo = new Date(Date.now() - 1000 * 60 * 20);
    const slots = await db.slot.updateMany({
      where: {
        type: SLOTTYPE.BLOCKED,
        updatedAt: { lte: oneHourAgo }
      },
      data: { type: SLOTTYPE.AVAILABLE }
    })

    if (!slots) {
      return createResponse("Slots not found", 503);
    } else {
      return createResponse("Slots have been unblocked", 201);
    }
  } catch (error) {
    return createResponse("An unexpected error has occurred", 500);
  }
}