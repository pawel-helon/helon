import { db } from "@/lib/db";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phoneNumber = searchParams.get("phoneNumber");

  if (!phoneNumber) {
    return createResponse("Phone number is required", 400);
  }

  try {
    const gettingDevice = await db.device.findUnique({
      where: {
       SIM: phoneNumber
      },
     
    });
    
    if (gettingDevice) {
      return createResponse(`Device with this phone number has been already added to the platform`, 200);
    } else {
      return createResponse("Device not found", 204);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}
