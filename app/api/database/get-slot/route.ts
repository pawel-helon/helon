import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slotId = searchParams.get("slotId");

  if (!slotId) {
    return new Response(JSON.stringify({ message: "Slot ID is required", status: 400 }))
  }

  const slot = await db.slot.findUnique({
    where: { id: slotId },
  });

  if (!slot) {
    return new Response(JSON.stringify({ message: "fail", slot: null, status: 404 }));
  } else {
    return new Response(JSON.stringify({ message: "success", slot: slot, status: 500 }));
  }
}
