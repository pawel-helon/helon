import { getRole } from "@/actions/server-actions";
import { Temp } from "@/components/features/temp";

export default async function TempPage() {
  const gettingRole = await getRole();
  if (!gettingRole.role) return null;
  const role = gettingRole.role;
  return (
    <div>
      {role}
      <Temp />
    </div>
  )
}