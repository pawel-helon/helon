import { db } from "@/lib/db";
import { Device, STATUS } from "@prisma/client";

function createResponse(message: string, status: number, device?: Device) {
  return new Response(JSON.stringify({ message, status, device }));
}

function getSuccessMessage(status: STATUS) {
  if (status === STATUS.ACTIVE) {
    return "Device has been activated";
  } else {
    return "Device has been deactivated";
  }
}

export async function PUT(request: Request) {
  const { deviceID, deviceStatus }: { deviceID: number, deviceStatus: STATUS } = await request.json();

  if (!deviceID) {
    return createResponse("deviceId is required", 400);
  }

  if (!deviceStatus) {
    return createResponse("deviceState is required", 400);
  }

  try {
    const updatingDevice = await db.device.update({
      where: {
        id: deviceID
      },
      data: {
        status: deviceStatus
      }
    })

    if (!updatingDevice) {
      return createResponse("Failed to update device status", 503);
    } else {
      return createResponse(getSuccessMessage(deviceStatus), 200);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}