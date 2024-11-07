import { db } from "@/lib/db";
import { Device, STATE, STATUS } from "@prisma/client";

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
      const creatingDevice = await db.device.create({
        data: {
          deviceName: "deviceName",
          address: "address",
          positionLng: 0,
          positionLat: 0,
          emei: "555555565555344",
          model: "model",
          SIM: "600000047",
          status: STATUS.INACTIVE,
          state: STATE.CLOSED,
          ownerId: 1,
          usersIds: []
        }
      })
      if (!creatingDevice) {
        return createResponse("Failed to create device", 503);
      }
      return createResponse("Device has been created", 201, creatingDevice);
    } else {
      return createResponse("Device has been fetched", 200, gettingDevice);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}
