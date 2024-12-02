import { db } from "@/lib/db";
import { generateRecurringDates } from "@/lib/helpers";
import { Slot } from "@prisma/client";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function DELETE(request: Request) {
  const { day, slots }: { day: string, slots: Slot[] } = await request.json();
  if (!day || !slots) {
    return createResponse("Day and slots are required", 400);
  }

  try {
    //Removing starting day
    const removingStartingDay = await db.recurringDate.delete({
      where: {
        dateTime: new Date(day)
      }
    });
    if (!removingStartingDay) {
      return createResponse("Failed to delete starting day", 503);
    }
    
    // Updating slots in starting day to non-recurring
    const dayStart = new Date(new Date(day).setHours(0,0,0,0));
    const dayEnd = new Date(new Date(day).setHours(23,59,59,999));
  
    const updatingSlots = await db.slot.updateMany({
      where: {
        dateTime: {
          gte: dayStart,
          lte: dayEnd
        }
      },
      data: {
        recurring: false
      }
    })
    if (!updatingSlots) {
      return createResponse("Failed to update slots", 503);
    }
    
    // Removing recurrring dates
    const recurringDates = await generateRecurringDates(day);
    if (!recurringDates) {
      return createResponse("Failed to generate recurring dates", 400);
    }
    for (const date of recurringDates) {
      const deletingRecurringDate = await db.recurringDate.delete({
        where: {
          dateTime: date,
        }
      });
      if (!deletingRecurringDate) {
        return createResponse("Failed to delete recurring dates", 503);
      }
    }
    
    // Removing recurring slots
    for (const date of recurringDates) {
      for (const slot of slots) {
        const deletingSlot = await db.slot.delete({
          where: {
            dateTime: new Date(date.setHours(
              new Date(slot.dateTime).getHours(),
              new Date(slot.dateTime).getMinutes(),
              new Date(slot.dateTime).getSeconds(),
              new Date(slot.dateTime).getMilliseconds()
            )),
        }
      });
      if (!deletingSlot) {
        return createResponse("Failed to delete slots", 503);
      }
      }
    }
    return createResponse("Recurring day has been disabled", 204);
  } catch (error) {
    console.error(error);
    return createResponse('An error occurred while setting recurring day', 500);
  }

}