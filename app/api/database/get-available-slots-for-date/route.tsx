import { db } from "@/lib/db";
import { Slot, SLOTTYPE } from "@prisma/client";

function createResponse(message: string, status: number, slots?: Slot[]) {
  return new Response(JSON.stringify({ message, status, slots }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return createResponse("Date is required", 400);
  }

  try {
    const slots = await db.slot.findMany({
      where: {
        dateTime: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lt: new Date(`${date}T23:59:59.999Z`),
        },
        type: SLOTTYPE.AVAILABLE,
      },
      orderBy: {
        dateTime: "asc"
      }
    });
    
    if (!slots) {
      return createResponse(`There are no slots available for ${date}`, 204);
    } else {
      return createResponse("Slots have been fetched", 200, slots);
    }
  } catch (error) {
    return createResponse("An unexpected error has occurred", 500);
  }
}
