import { getRole } from "@/actions/server-actions";
import { ROLE } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function DocsUsersPage() {
  const gettingRole = await getRole();
  if (!gettingRole) return;
  const role = gettingRole.role as ROLE;
  
  if (role !== ROLE.ADMIN) {
    redirect("/features/docs/devices/adding-new-device");
  } else {
    redirect("/features/docs/users/adding-new-user");
  }
}