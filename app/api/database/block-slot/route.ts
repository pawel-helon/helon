import { db } from "@/lib/db";
import { SLOTTYPE } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slotId = searchParams.get("slotId");

  if (!slotId) {
    return new Response(JSON.stringify({ message: "Slot ID is required", status: 400 }))
  }

  const slot = await db.slot.update({
    where: { id: slotId },
    data: { type: SLOTTYPE.BLOCKED},
  });

  if (!slot) {
    return new Response(JSON.stringify({ message: "fail", status: 404 }));
  } else {
    return new Response(JSON.stringify({ message: "success", status: 500 }));
  }
}
