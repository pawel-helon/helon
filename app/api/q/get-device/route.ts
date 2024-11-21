import { db } from "@/lib/db";
import { Device } from "@prisma/client";
import { revalidatePath } from "next/cache";

function createResponse(message: string, status: number, device?: Device) {
  return new Response(JSON.stringify({ message, status, device }));
}

export async function GET(request: Request) {
  try {
    const gettinOldestDevice = await db.device.findFirst({
      orderBy: {
       createdAt: 'asc'
      },
     
    });
    if (!gettinOldestDevice) {
      return createResponse("Failed to fetch device", 503)
    }
    revalidatePath('/');
    return createResponse("Device has been fetched", 200, gettinOldestDevice);
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}
