import { db } from "@/lib/db";
import { SLOTTYPE } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slotId = searchParams.get("slotId");
  const fullName = searchParams.get("fullName");
  const email = searchParams.get("email");
  const message = searchParams.get("message") || null;

  if (!slotId || !fullName || !email) {
    return new Response(JSON.stringify({ message: "Slot ID is required", status: 400 }))
  }

  const meeting = await db.meeting.create({
    data: {
      userName: fullName,
      userEmail: email,
      slotId: slotId,
      message: message
    }
  })

  const slot = await db.slot.update({
    where: { id: slotId },
    data: { type: SLOTTYPE.BOOKED},
  });

  if (!slot || !meeting) {
    return new Response(JSON.stringify({ message: "fail", status: 404 }));
  } else {
    return new Response(JSON.stringify({ message: "success", status: 500 }));
  }
}
