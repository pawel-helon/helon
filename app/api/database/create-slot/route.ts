import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") as string;

  if (!date) {
    return new Response(JSON.stringify({ message: "Date is required", status: 400 }));
  }

  const slot = await db.slot.create({
    data: { dateTime: date },
  });

  if (!slot) {
    return new Response(JSON.stringify({ message: "fail", status: 404 }));
  } else {
    return new Response(JSON.stringify({ message: "success", slot: slot, status: 500 }));
  }
}
