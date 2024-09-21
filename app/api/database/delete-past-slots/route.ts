import { db } from "@/lib/db";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function GET() {
  try {
    const slots = await db.slot.deleteMany({
      where : {
        dateTime: {
          lte: new Date()
        }
      }
    })
    
    if (!slots) {
      return createResponse("Slots not found", 503);
    } else {
      return createResponse("Past slots have been deleted", 200);
    }
  } catch (error) {
    return createResponse("An unexpected error has occurred", 500);
  }
}