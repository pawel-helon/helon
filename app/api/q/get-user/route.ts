import { db } from "@/lib/db";
import { User } from "@prisma/client";

function createResponse(message: string, status: number, user?: User) {
  return new Response(JSON.stringify({ message, status, user }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userID = Number(searchParams.get("userID"));

  if (!userID) {
    return createResponse("User id is required", 400);
  }

  try {
    const gettingUser = await db.user.findUnique({
      where: {
       id: userID
      },
     
    });
    
    if (!gettingUser) {
      return createResponse(`User not found`, 503);
    } else {
      return createResponse("User has been fetched", 200, gettingUser);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}
