import { db } from "@/lib/db";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

async function generateRecurringDates(dateTime: string): Promise<Date[]> {
  const endOfYear = new Date(new Date(dateTime).getFullYear(), 11, 31, 23, 59, 999);
  const currentRecurringDate = new Date(new Date(dateTime).setDate(new Date(dateTime).getDate() + 7));
  
  const recurringDates: Date[] = [];
  while (currentRecurringDate <= endOfYear) {
    recurringDates.push(new Date(currentRecurringDate));
    currentRecurringDate.setDate(currentRecurringDate.getDate() + 7);
  }
  
  return recurringDates;
}

export async function POST(request: Request) {
  const { slotId, dateTime } = await request.json();
  if (!slotId || !dateTime) {
    return createResponse("Slot is required", 400);
  }

  const recurringDates = await generateRecurringDates(dateTime);
  if (!recurringDates) {
    return createResponse("Failed to generate recurring dates", 400);
  }

  try {
    // Update recurring field of the initial slot to false
    const updateSlot = await db.slot.update({
      where: {
        id: slotId
      },
      data: {
        recurring: false
      }
    })

    if (!updateSlot) {
      return createResponse("Failed to update slot", 503);
    }
    // Delete recurring slots
    let recurringSlotsDeleted: boolean = false;
    for (const date of recurringDates) {
      const recurringSlot = await db.slot.delete({
        where: {
          dateTime: new Date(date.setHours(
            new Date(dateTime).getHours(),
            new Date(dateTime).getMinutes(),
            new Date(dateTime).getSeconds(),
            new Date(dateTime).getMilliseconds()
          )),
        }
      });
      if (!recurringSlot) {
        return createResponse("Failed to delete recurring slots", 503);
      }
      recurringSlotsDeleted = true;
    }
  
    if (!recurringSlotsDeleted) {
      return createResponse("Failed to delete recurring slots", 503);
    }

    return createResponse("Recurring slots have been removed", 204);
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error occurred", 500);
  }  
}