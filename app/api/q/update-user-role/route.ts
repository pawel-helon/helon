import { db } from "@/lib/db";
import { Device, ROLE } from "@prisma/client";

function createResponse(message: string, status: number, device?: Device) {
  return new Response(JSON.stringify({ message, status, device }));
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

export async function PUT(request: Request) {
  const { userID, userRole }: {userID: number, userRole: ROLE } = await request.json();

  if (!userID || !userRole) {
    return createResponse("userId and userRole are required", 400);
  }

  try {
    const updatingUser = await db.user.update({
      where: {
        id: userID
      },
      data: {
        role: userRole
      }
    })

    if (!updatingUser) {
      return createResponse("Failed to update user role", 503);
    } else {
      return createResponse(`User role has been changed to ${capitalizeFirstLetter(userRole)}`, 200);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}