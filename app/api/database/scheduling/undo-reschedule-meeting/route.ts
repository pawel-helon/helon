import { db } from "@/lib/db";
import { SLOTTYPE } from "@prisma/client";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function PUT(request: Request) {
  const { meetingId, slotId }: { meetingId: string, slotId: string } = await request.json();

  try {
    const gettingSlotId = await db.meeting.findUnique({
      where: { id: meetingId },
      select: { slotId: true }
    })
    if (!gettingSlotId) {
      return createResponse("Failed to unblock slot", 503);
    }
    
    const unblockingNewSlot = await db.slot.update({
      where: { id: gettingSlotId.slotId },
      data: { type: SLOTTYPE.AVAILABLE }
    })
    if (!unblockingNewSlot) {
      return createResponse("Failed to unblock slot", 503);
    }

    const blockingInitialSlot  = await db.slot.update({
      where: { id: slotId },
      data: { type: SLOTTYPE.BOOKED }
    })
    if (!blockingInitialSlot) {
      return createResponse("Failed to block slot", 503);
    }

    const undoingRescheduleMeeting = await db.meeting.update({
      where: {
        id: meetingId
      },
      data: {
        dateTime: new Date(blockingInitialSlot.dateTime)
      }
    })
    if (!undoingRescheduleMeeting) {
      return createResponse("Failed to reschedule meeting", 503);
    }
    return createResponse("Meeting has been rescheduled", 200 )
  } catch (error) {
    return createResponse("An unexpected error has occurred", 500);
  }
}