import { db } from "@/lib/db";
import { SLOTTYPE } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") as string;

  if (!date) {
    return new Response(JSON.stringify({ message: "Date is required", status: 400 }))
  }

  const slots = await db.slot.findMany({
    where: {
      dateTime: {
        gte: new Date(`${date}T00:00:00.000Z`),
        lt: new Date(`${date}T23:59:59.999Z`),
      },
      type: SLOTTYPE.AVAILABLE,
    },
  });

  if (!slots) {
    return new Response(JSON.stringify({ message: "fail", status: 404 }))
  } else {
    return new Response(JSON.stringify({ message: "success", slots: slots, status: 500 }));
  }
}
