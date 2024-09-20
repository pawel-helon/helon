import { db } from "@/lib/db";
import { SLOTTYPE } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slotId = searchParams.get("slotId");
    const fullName = searchParams.get("fullName");
    const email = searchParams.get("email");
    const message = searchParams.get("message") || null;
  
    if (!slotId || !fullName || !email) {
      return new Response(JSON.stringify({ message: "Slot id, full name, and email are required", status: 400 }))
    }

    const slot = await db.slot.findUnique({
      where: { id: slotId },
      select: { dateTime: true }
    })

    if (!slot) {
      return new Response(JSON.stringify({ message: "Failed to fetch slot", status: 400 }))
    }

    const meeting = await db.meeting.create({
      data: {
        dateTime: slot!.dateTime,
        userName: fullName,
        userEmail: email,
        slotId: slotId,
        message: message
      }
    })

    if (!meeting) {
      return new Response(JSON.stringify({ message: "Failed to create meeting", status: 400 }));
    }
    
    const updatingSlot = await db.slot.update({
      where: { id: slotId },
      data: { type: SLOTTYPE.BOOKED},
    });

    if (!updatingSlot) {
      return new Response(JSON.stringify({ message: "Failed to updated slot", status: 400 }));
    }
  
    return new Response(JSON.stringify({ message: "Success", meeting: meeting, status: 200 }));
  } catch (error) {
    console.error('Error updating slot: ', error);
  }

}
