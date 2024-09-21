import { db } from "@/lib/db";
import { SLOTTYPE } from "@prisma/client";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status}));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slotId = searchParams.get("slotId");
  
  if (!slotId) {
    return createResponse("Slot ID is required", 400);
  }

  try {
    const slot = await db.slot.update({
      where: { id: slotId },
      data: { type: SLOTTYPE.BLOCKED},
    });
  
    if (!slot) {
      return createResponse("Slot not found", 503);
    } else {
      return createResponse("Slot has been blocked", 201);
    }
  } catch (error) {
    return createResponse("An unexpected error has occurred", 500);
  }
}
