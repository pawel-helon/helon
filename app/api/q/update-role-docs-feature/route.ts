import { db } from "@/lib/db";
import { ROLE } from "@prisma/client";

function createResponse(message: string, status: number ) {
  return new Response(JSON.stringify({ message, status }));
}

export async function PUT(request: Request) {
  const { role }: { role: ROLE } = await request.json();

  if (!role) {
    return createResponse("role is required", 400);
  }

  try {
    const updatingRole = await db.user.update({
      where: {
        id: 1
      },
      data: {
        role: role,
      }
    })

    if (!updatingRole) {
      return createResponse("Failed to update role", 503);
    } else {
      return createResponse("Role updated", 200);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}