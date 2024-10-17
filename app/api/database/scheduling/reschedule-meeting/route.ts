import { db } from "@/lib/db";
import { SLOTTYPE } from "@prisma/client";

function createResponse(message: string, status: number, prevSlotId?: string) {
  return new Response(JSON.stringify({ message, status, prevSlotId }));
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
    
    const unblockingInitialSlot = await db.slot.update({
      where: { id: gettingSlotId.slotId },
      data: { type: SLOTTYPE.AVAILABLE }
    })
    if (!unblockingInitialSlot) {
      return createResponse("Failed to unblock slot", 503);
    }

    const blockingNewSlot  = await db.slot.update({
      where: { id: slotId },
      data: { type: SLOTTYPE.BOOKED }
    })
    if (!blockingNewSlot) {
      return createResponse("Failed to block slot", 503);
    }

    const reschedulingMeeting = await db.meeting.update({
      where: {
        id: meetingId
      },
      data: {
        dateTime: new Date(blockingNewSlot.dateTime)
      }
    })
    if (!reschedulingMeeting) {
      return createResponse("Failed to reschedule meeting", 503);
    }
    return createResponse("Meeting has been rescheduled", 200, unblockingInitialSlot.id)
  } catch (error) {
    return createResponse("An unexpected error has occurred", 500);
  }
}