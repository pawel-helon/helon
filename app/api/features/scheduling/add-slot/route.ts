import { db } from "@/lib/db";
import { generateAvailableTimes, getDayEnd, getDayStart } from "@/lib/helpers";

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

  try {
    const addingSlot = await db.slot.create({
      data: {
        dateTime: new Date(`${day}T${firstAvailableTime}`)
      }
    })
    
    if (!addingSlot || !firstAvailableTime[0]) {
      return createResponse("Failed to add slot", 503);
    }
    
    return createResponse("Slot has been added", 201);
  } catch (error) {
    console.error(error);
    return createResponse('An error occurred while adding slot', 500);
  }
}
