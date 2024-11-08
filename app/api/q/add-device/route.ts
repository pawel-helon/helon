import { db } from "@/lib/db";
import { STATE, STATUS } from "@prisma/client";

function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message, status}));
}

export async function POST(request: Request) {
  const { deviceName, emei, phoneNumber }: { deviceName: string, emei: string, phoneNumber: string } = await request.json();

  if (!deviceName || !emei || !phoneNumber) {
    return createResponse("deviceName, emei, and phoneNumber are required", 400);
  }

  try {
    const addingDevice = await db.device.create({
      data: {
        deviceName: deviceName,
        positionLng: 0,
        positionLat: 0,
        emei: emei,
        model: "MZ-12",
        SIM: phoneNumber,
        status: STATUS.INACTIVE,
        state: STATE.CLOSED,
        ownerId: 1,
      }
    })

    if (!addingDevice) {
      return createResponse("Failed to update device state", 503);
    } else {
      return createResponse(`${deviceName} device has been added to the platform`, 201);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}