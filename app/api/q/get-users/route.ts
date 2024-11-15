import { db } from "@/lib/db";
import { ROLE, User } from "@prisma/client";

function createResponse(message: string, status: number, users?: User[]) {
  return new Response(JSON.stringify({ message, status, users }));
}

export async function GET(request: Request) {
  
  
  const count = await db.user.count();
  if (count === 0) {
    const creatingUsers = await db.user.createMany({
      data: [
        {
          name: "Alex Atkins",
          email: "a.atkins@qt2.com",
          role: ROLE.ADMIN,
          password: "password"
        },
        {
          name: "Bob Berkley",
          email: "b.berkley@qt2.com",
          role: ROLE.OWNER,
          password: "password"
        },
        {
          name: "Clair Clarkson",
          email: "c.clarkson@qt2.com",
          role: ROLE.ENDUSER,
          password: "password"
        },
        {
          name: "David Daniels",
          email: "d.daniels@qt2.com",
          role: ROLE.OWNER,
          password: "password"
        },
        {
          name: "Ethan Edwards",
          email: "e.edwards@qt2.com",
          role: ROLE.OWNER,
          password: "password"
        },
        {
          name: "Frank Fisher",
          email: "f.fisher@qt2.com",
          role: ROLE.OWNER,
          password: "password"
        }
      ]
    })
    if (!creatingUsers) {
      return createResponse("Failed to create users", 503);
    } else {
      const fetchingUsers = await db.user.findMany();
      return createResponse("Users fetched", 200, fetchingUsers);
    }
  } else {
    const fetchingUsers = await db.user.findMany();
    return createResponse("Users fetched", 200, fetchingUsers);
  }
}
