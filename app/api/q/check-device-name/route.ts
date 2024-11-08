import { db } from "@/lib/db";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deviceName = searchParams.get("deviceName");

  if (!deviceName) {
    return createResponse("Device name is required", 400);
  }

  try {
    const gettingDevice = await db.device.findUnique({
      where: {
       deviceName: deviceName
      },
     
    });
    
    if (gettingDevice) {
      return createResponse(`Device with this name has been already added to the platform.`, 200);
    } else {
      return createResponse("Device not found", 204);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}
