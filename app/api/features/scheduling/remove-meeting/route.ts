import { db } from "@/lib/db";
import { Meeting } from "@prisma/client";

function createResponse(message: string, status: number, meeting?: Meeting) {
  return new Response(JSON.stringify({ message, status, meeting }));
}

export async function DELETE(request: Request) {
  const { meetingId }: { meetingId: string } = await request.json();

  try {
    // storing meeting for undo action
    const storingMeeting = await db.meeting.findUnique({
      where: {
        id: meetingId
      }
    }) as Meeting;
    if (!storingMeeting) {
      return createResponse("Failed to fetch meeting", 503);
    }

    // removing meeting
    const deletingMeeting = await db.meeting.delete({
      where: {
        id: meetingId
      }
    })
    if (!deletingMeeting) {
      return createResponse("Failed to delete meeting", 503);
    }
    return createResponse(`Meeting with ${storingMeeting.userName} has been removed`, 204, storingMeeting);
  } catch (error) {
    return createResponse("An unexpected error has occurred", 500);
  }
}