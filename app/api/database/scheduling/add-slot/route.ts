import { db } from "@/lib/db";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

async function generateAvailableTimes(day: string): Promise<string> {
  const allTimes = [] as string[];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      allTimes.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  const startOfDay = new Date(`${day}T00:00:00.000Z`);
  const endOfDay = new Date(`${day}T23:59:59.999Z`);

  const existingSlots = await db.slot.findMany({
    where: {
      dateTime: {
        gte: startOfDay,
        lte: endOfDay
      }
    },
    select: {
      dateTime: true
    }
  });

  const unavailableTimes = [] as string[];
  for (const slot of existingSlots) {
    const time = String(new Date(slot.dateTime).getHours()).padStart(2, '0') + ':' + String(new Date(slot.dateTime).getMinutes()).padStart(2, '0');
    unavailableTimes.push(time);
  }
  
  const firstAvailableTime = allTimes.filter((time) => !unavailableTimes.includes(time))[0];
  return firstAvailableTime as string;
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
