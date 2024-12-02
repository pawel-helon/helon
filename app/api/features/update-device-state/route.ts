import { db } from "@/lib/db";
import { Device, STATE } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
  const { deviceState }: { deviceState: STATE } = await request.json();

  if (!deviceState) {
    return createResponse("deviceId and deviceState are required", 400);
  }

  try {
    const gettingOldestDevice = await db.device.findFirst({
      orderBy: {
        createdAt: 'asc'
      }
    })

    if (!gettingOldestDevice) {
      return createResponse("Failed to fetch device", 503)
    }
    
    const updatingDevice = await db.device.update({
      where: {
        id: gettingOldestDevice.id
      },
      data: {
        state: deviceState
      }
    })

    if (!updatingDevice) {
      return createResponse("Failed to update device state", 503);
    } else {
      revalidatePath('/features/qr-codes');
      return createResponse(getSuccessMessage(deviceState), 200, updatingDevice);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}