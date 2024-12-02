import { db } from "@/lib/db";
import { generateAvailableTimes, generateRecurringDates, getDayEnd, getDayStart } from "@/lib/helpers";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function POST(request: Request) {
  const { day } = await request.json();
  if (!day) {
    return createResponse("Day is required", 400);
  }

  const firstAvailableTime = await generateAvailableTimes(day);
  if (!firstAvailableTime) {
    return createResponse("No available times", 400);
  }

  const recurringDates = await generateRecurringDates(day);
  if (!recurringDates) {
    return createResponse("Failed to generate recurring dates", 400);
  }

  try {
    const addingSlots = await db.slot.createMany({
      data: recurringDates.map((date) => ({
        dateTime: new Date(new Date(date).setHours(Number(firstAvailableTime.split(':')[0]), Number(firstAvailableTime.split(':')[1]), 0, 0)),
        recurring: true
      })),
    })

    if (!addingSlots) {
      return createResponse("Failed to add slots", 503);
    }
    
    return createResponse("Slot has been added", 201);
  } catch (error) {
    console.error(error);
    return createResponse('An error occurred while adding slots', 500);
  }
}