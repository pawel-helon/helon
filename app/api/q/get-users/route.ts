import { db } from "@/lib/db";
import { ROLE, User } from "@prisma/client";

function createResponse(message: string, status: number, users?: User[]) {
  return new Response(JSON.stringify({ message, status, users }));
}

export async function GET(request: Request) {
  const fetchingUsers = await db.user.findMany();
  if (!fetchingUsers) {
    return createResponse("Failed to fetch users", 503)
  }
  return createResponse("Users fetched", 200, fetchingUsers);
}
