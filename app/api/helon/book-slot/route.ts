import { db } from "@/lib/db";
import { Meeting, SLOTTYPE } from "@prisma/client";

interface MeetingRequest {
  slotId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  message?: string;
}

function createResponse(message: string, status: number, meeting?: Meeting) {
  return new Response(JSON.stringify({ message, status, meeting }));
}

export async function POST(request: Request) {
  const { slotId, fullName, phoneNumber, email, message }: MeetingRequest = await request.json();
  
  if (!slotId || !fullName || !phoneNumber || !email) {
    return createResponse("Slot id, full name, and email are required", 400);
  }

  try {
    const slot = await db.slotHelon.findUnique({
      where: { id: slotId },
      select: { dateTime: true }
    })

    if (!slot) {
      return createResponse("Slot not found", 503);
    }

    const meeting = await db.meetingHelon.create({
      data: {
        dateTime: slot.dateTime,
        userName: fullName,
        userPhoneNumber: phoneNumber,
        userEmail: email,
        slotId: slotId,
        message: message
      }
    })
  
    if (!meeting) {
      return createResponse("Failed to create meeting", 503);
    }

    const updatedSlot = await db.slotHelon.update({
      where: { id: slotId },
      data: { type: SLOTTYPE.BOOKED},
    });
    
    if (!updatedSlot) {
      return createResponse("Failed to update slot", 503);
    } 
    
    return createResponse("Meeting has been created", 201, meeting);
  } catch (error) {
    return createResponse("An unexpected error has occurred", 500);
  }
}
