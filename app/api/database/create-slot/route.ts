import { db } from "@/lib/db";
import { Slot } from "@prisma/client";

function createResponse(message: string, status: number, slot?: Slot) {
  return new Response(JSON.stringify({ message, status, slot }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") as string;

  if (!date) {
    return createResponse("Date is required", 400);
  }

  try {
    const slot = await db.slot.create({
      data: { dateTime: date },
    });
  
    if (!slot) {
      return createResponse("Slot not found", 503);
    } else {
      return createResponse("Slot has been created", 201, slot);
    }
  } catch (error) {
    return createResponse("An unexpected error has occurred", 500);
  }
}
