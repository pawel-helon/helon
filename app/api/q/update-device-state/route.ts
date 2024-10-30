import { db } from "@/lib/db";
import { Device, STATE } from "@prisma/client";

function createResponse(message: string, status: number, device?: Device) {
  return new Response(JSON.stringify({ message, status, device }));
}

function getSuccessMessage(status: STATE) {
  if (status === STATE.OPENED) {
    return "Device has been opened";
  } else {
    return "Device has been close";
  }
}

export async function PUT(request: Request) {
  const { deviceID, deviceState }: { deviceID: number, deviceState: STATE } = await request.json();

  if (!deviceID || !deviceState) {
    return createResponse("deviceId and deviceState are required", 400);
  }

  try {
    const updatingDevice = await db.device.update({
      where: {
        id: deviceID
      },
      data: {
        state: deviceState
      }
    })

    if (!updatingDevice) {
      return createResponse("Failed to update device state", 503);
    } else {
      return createResponse(getSuccessMessage(deviceState), 200);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}