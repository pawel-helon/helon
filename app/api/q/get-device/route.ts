import { db } from "@/lib/db";
import { Device } from "@prisma/client";

function createResponse(message: string, status: number, device?: Device) {
  return new Response(JSON.stringify({ message, status, device }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deviceID = Number(searchParams.get("deviceID"));

  if (!deviceID) {
    return createResponse("Device id required", 400);
  }

  try {
    const gettingDevice = await db.device.findUnique({
      where: {
       id: deviceID
      },
     
    });
    
    if (!gettingDevice) {
      return createResponse(`Device not found`, 503);
    } else {
      return createResponse("Slots have been fetched", 200, gettingDevice);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}
