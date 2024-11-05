import { db } from "@/lib/db";
import { ROLE } from "@prisma/client";

function createResponse(message: string, status: number ) {
  return new Response(JSON.stringify({ message, status }));
}

export async function PUT(request: Request) {
  const { role, ids }: { role: ROLE, ids: number[]} = await request.json();

  if (!role || !ids) {
    return createResponse("role and user ids are required", 400);
  }

  try {
    const updatingRole = await db.user.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: {
        role: role,
      }
    })

    if (!updatingRole) {
      return createResponse("Failed to update role", 503);
    } else {
      return createResponse("Roles updated", 200);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}