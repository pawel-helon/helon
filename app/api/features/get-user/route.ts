import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

function createResponse(message: string, status: number, user?: User) {
  return new Response(JSON.stringify({ message, status, user }));
}

export async function GET(request: Request) {
  try {
    const gettingOldestAccount = await db.user.findFirst({
      orderBy: {
       createdAt: 'asc'
      },
    });
    
    if (!gettingOldestAccount) {
      return createResponse(`User not found`, 503);
    } else {
      revalidatePath('/');
      return createResponse("User has been fetched", 200, gettingOldestAccount);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}
