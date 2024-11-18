import { db } from "@/lib/db";
import { Device, STATE, STATUS } from "@prisma/client";

function createResponse(message: string, status: number, device?: Device) {
  return new Response(JSON.stringify({ message, status, device }));
}

export async function GET(request: Request) {
  try {
    const gettinOldestgDevice = await db.device.findFirst({
      orderBy: {
       createdAt: 'asc'
      },
     
    });
    if (!gettinOldestgDevice) {
      return createResponse("Failed to fetch device", 503)
    }
    return createResponse("Device has been fetched", 200, gettinOldestgDevice);
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}
