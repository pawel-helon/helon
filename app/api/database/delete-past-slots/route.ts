import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    await db.slot.deleteMany({
      where : {
        dateTime: {
          lte: new Date()
        }
      }
    })

    return new Response(JSON.stringify({ message: "success", status: 200 }));
  } catch (error) {
    console.error('Error deleting past slots: ', error);
  }
}