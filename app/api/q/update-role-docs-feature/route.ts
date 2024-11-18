import { db } from "@/lib/db";
import { ROLE } from "@prisma/client";
import { revalidatePath } from "next/cache";

function createResponse(message: string, status: number ) {
  return new Response(JSON.stringify({ message, status }));
}

export async function PUT(request: Request) {
  const { role }: { role: ROLE } = await request.json();

  if (!role) {
    return createResponse("role is required", 400);
  }

  try {
    const gettingOldestUser = await db.user.findFirst({
      orderBy: {
        createdAt: 'asc'
      }
    })

    if (!gettingOldestUser) {
      return createResponse("Failed to fetch user", 503);
    }

    const updatingRole = await db.user.update({
      where: {
        id: gettingOldestUser.id
      },
      data: {
        role: role,
      }
    })

    if (!updatingRole) {
      return createResponse("Failed to update role", 503);
    } else {
      revalidatePath('/features/docs');
      return createResponse("Role updated", 200);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}