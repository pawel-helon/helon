import { db } from "@/lib/db";
import { generateRecurringDates } from "@/lib/helpers";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function POST(request: Request) {
  const { slotId, dateTime }: { slotId: string, dateTime: Date } = await request.json();
  if (!slotId) {
    return createResponse("Slot ID is required", 400);
  }

  const recurringDates = await generateRecurringDates(dateTime);
  if (!recurringDates) {
    return createResponse("Failed to generate recurring dates", 400);
  }
  
  try {
    // Update recurring field of the initial slot to true
    const updateSlot = await db.slot.update({
      where: {
        id: slotId
      },
      data: {
        recurring: true
      }
    })

    if (!updateSlot) {
      return createResponse("Failed to update slot", 503);
    }
    // Create recurring slots
    let slotsUpdated: boolean = false;
    const recurringSlots = await db.slot.createMany({
      data: recurringDates.map(date => ({
        dateTime: new Date(date.setHours(
          new Date(dateTime).getHours(),
          new Date(dateTime).getMinutes(),
          new Date(dateTime).getSeconds(),
          new Date(dateTime).getMilliseconds()
        )),
        recurring: true
      })),
      skipDuplicates: true
    });
    if (!recurringSlots) {
      return createResponse("Failed to create recurring slots", 503);
    }
    slotsUpdated = true;

    if (!slotsUpdated) {
      return createResponse("Failed to create slots", 503);
    }
    return createResponse("Recurring slots have been added", 201);
  } catch (error) {
    console.error(error);
    createResponse('An error occurred while setting recurring slots', 500);
  } 

}