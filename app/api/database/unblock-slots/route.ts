import { db } from "@/lib/db";
import { SLOTTYPE } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);
    await db.slot.updateMany({
      where: {
        type: SLOTTYPE.BLOCKED,
        updatedAt: {
          lte: oneHourAgo
        }
      },
      data: {
        type: SLOTTYPE.AVAILABLE
      }
    })

    return new Response(JSON.stringify({ message: "success", status: 200 }));
  } catch (error) {
    console.error('Error updating slots: ', error);
  }
}