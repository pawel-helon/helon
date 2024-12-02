import { db } from "@/lib/db";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function PUT(request: Request) {
  const { slotId, dateTime, hour }: {slotId: string, dateTime: Date, hour: string} = await request.json();
  if (!slotId || !dateTime || !hour) {
    return createResponse("Slot ID, date and hour are required", 400);
  }

  try {
    const updatingSlotHour = await db.slot.update({
      where: {
        id: slotId
      },
      data: {
        dateTime: new Date(new Date(dateTime).setHours(Number(hour)))
      }
    });

    if (!updatingSlotHour) {
      return createResponse("Failed to update slot", 503);
    }
    return createResponse("Slot has been updated", 200);
  } catch (error) {
    console.error(error);
    createResponse('An error occurred while restoring slot', 500);
  }
}