import { db } from "@/lib/db";
import { Slot } from "@prisma/client";

function createResponse(message: string, status: number, slot?: Slot) {
  return new Response(JSON.stringify({ message, status, slot }));
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
    });
    if (!slot) {
      return createResponse("Slot not found", 503);
    } else {
      return createResponse("Slot has been fetched", 200, slot);
    }

  } catch (error) {
    return createResponse("An unexpected error has occurred", 500);
  }
}
