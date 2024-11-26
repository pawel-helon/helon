import { db } from "@/lib/db";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function PUT(request: Request) {
  const { slotId, dateTime, hour, minutes }: {slotId: string, dateTime: Date, hour: string, minutes: string} = await request.json();
  if (!slotId || !dateTime || !hour || !minutes) {
    return createResponse("Slot ID, date and time are required", 400);
  }

  const date = String(dateTime).split('T')[0];
  const newDateTime = new Date(new Date(date).setHours(Number(hour), Number(minutes), 0, 0));
  
  try {
    const updatingSlotHour = await db.slot.update({
      where: {
        id: slotId
      },
      data: {
        dateTime: newDateTime
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