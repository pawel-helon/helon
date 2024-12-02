import { db } from "@/lib/db";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function POST(request: Request) {
  const { dateTime }: { dateTime: Date } = await request.json();
  if (!dateTime) {
    return createResponse("Date and slot ID are required", 400);
  }

  try {
    const deletingSlot = await db.slot.create({
      data: {
        dateTime: new Date(dateTime),
      }
    })
    
    if (!deletingSlot) {
      return createResponse("Failed to delete slot", 503);
    }
    return createResponse("Slot has been restored", 201);
  } catch (error) {
    console.error(error);
    createResponse('An error occurred while restoring slot', 500);
  }
}