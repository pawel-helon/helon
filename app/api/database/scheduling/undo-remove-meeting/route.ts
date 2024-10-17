import { db } from "@/lib/db";
import { Meeting } from "@prisma/client";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function POST(request: Request) {
  const { meeting }: { meeting: Meeting } = await request.json();

  try {
    const restoringMeeting = await db.meeting.create({
      data: {
        id: meeting.id,
        dateTime: new Date(meeting.dateTime),
        userName: meeting.userName,
        userEmail: meeting.userEmail,
        slotId: meeting.slotId,
        message: meeting.message
      }
    })
    if (!restoringMeeting) {
      return createResponse("Failed to restore meeting", 503);
    }
    return createResponse(`Meeting with ${restoringMeeting.userName} has been restored`, 201);
  } catch (error) {
    return createResponse("An unexpected error has occurred", 500);
  }
}