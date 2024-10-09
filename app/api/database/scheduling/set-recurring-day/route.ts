import { db } from "@/lib/db";
import { Slot } from "@prisma/client";

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
  const { day, slots }: { day: string, slots: Slot[]} = await request.json();
  if (!day || !slots) {
    return createResponse("Day and slots are required", 400);
  }

  try {
    // Add initial day to recurring dates
    const startingDate = await db.recurringDate.create({
      data: {
        dateTime: new Date(day)
      }
    })
    if (!startingDate) {
      return createResponse("Failed to store starting date", 503);
    }
    //Update slots recurring field to true for initial day
    const updateSlots = await db.slot.updateMany({
      where: {
        id: {
          in: slots.map(slot => slot.id)
        }
      },
      data: {
        recurring: true
      }
    })
    if (!updateSlots) {
      return createResponse("Failed to update slots", 503);
    }
    
    // Storing recurring dates
    const recurringDates = await generateRecurringDates(day);
    if (!recurringDates) {
      return createResponse("Failed to generate recurring dates", 400);
    }

    const storingRecurringDates = await db.recurringDate.createMany({
      data: recurringDates.map(date => ({
        dateTime: date
      }))
    })

    if (!storingRecurringDates) {
      return createResponse("Failed to create recurring days", 503);
    }

    for (const date of recurringDates) {
      for (const slot of slots) {
        const updateSlot = await db.slot.create({
          data: {
            dateTime: new Date(date.setHours(
              new Date(slot.dateTime).getHours(),
              new Date(slot.dateTime).getMinutes(),
              new Date(slot.dateTime).getSeconds(),
              new Date(slot.dateTime).getMilliseconds()
            )),
            recurring: true
          }
        })
        if (!updateSlot) {
          return createResponse("Failed to update slot", 503);
        }
      }
    }
    return createResponse("Recurring day has been set", 201);
  } catch (error) {
    console.error(error);
    createResponse('An error occurred while setting recurring day', 500);
  }
  
}