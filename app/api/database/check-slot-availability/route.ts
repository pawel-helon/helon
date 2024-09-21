import { db } from "@/lib/db";
import { SLOTTYPE } from "@prisma/client";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slotId = searchParams.get("slotId");
  
  if (!slotId) {
    return createResponse("Slot ID is required", 400);
  }

  try {
    const slot = await db.slot.findUnique({
      where: { id: slotId },
      select: { type: true }
    });

    if (!slot) {
      return createResponse("Slot not found", 503);
    } else {
      if (slot.type === SLOTTYPE.AVAILABLE) {
        return createResponse("Slot is available", 200);
      } else {
        return createResponse("Slot is not available", 404);
      }
    }
  } catch (error) {
    return createResponse("An unexpected error has occurred", 500);
  }
}
