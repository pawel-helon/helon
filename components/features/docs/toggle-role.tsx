import { updateRoleDocsFeature } from "@/actions/database-actions";
import { Button } from "@/components/ui/button";
import { ROLE } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ROLES = [ROLE.ENDUSER, ROLE.OWNER, ROLE.ADMIN]

export function ToggleRole(props: { role: ROLE }) {
  const router = useRouter();
  async function handleChangeRole(role: ROLE) {
    try {
      const updatingRole = await updateRoleDocsFeature(role);
      if (updatingRole.status !== 200) {
        toast.error(updatingRole.message);
        return;
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Try again later.')
    }
  }
  
  return (
    <div className='flex items-center gap-0.5 p-1.5 border border-border rounded-full shadow-black shadow-sm bg-background-sh'>
      {ROLES.map((role) => (
        <Button key={role} onClick={() => handleChangeRole(role)} size="sm" variant={role === props.role ? "tertiary" : "ghost"} className="rounded-full">
          {role.toLowerCase()}
        </Button>
      ))}
    </div>
  )
}