import { db } from "@/lib/db";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function DELETE(request: Request) {
  const { slotId } = await request.json();
  if (!slotId) {
    return createResponse("Slot ID is required", 400);
  }

  try {
    const deletingSlot = await db.slot.delete({
      where: {
        id: slotId
      }
    })
    
    if (!deletingSlot) {
      return createResponse("Failed to delete slot", 503);
    }
    return createResponse("Slot has been deleted", 202);
  } catch (error) {
    console.error(error);
    createResponse('An error occurred while deleting slot', 500);
  }
}