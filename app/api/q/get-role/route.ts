import { db } from "@/lib/db";
import { ROLE, User } from "@prisma/client";

function createResponse(message: string, status: number, role?: ROLE) {
  return new Response(JSON.stringify({ message, status, role }));
}

export async function GET(request: Request) {
  try {
    const gettingRole = await db.user.findUnique({
      where: {
       id: 1
      },
      select: {
        role: true
      }
     
    });
    
    if (!gettingRole) {
      return createResponse(`User not found`, 503);
    } else {
      return createResponse("Role has been fetched", 200, gettingRole.role);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}
