import { useTransition } from "react";
import { toast } from "sonner";
import { updateRoleDocsFeature } from "@/actions/database-actions";
import { Button } from "@/components/ui/button";
import { ROLE } from "@prisma/client";

const ROLES = [ROLE.ENDUSER, ROLE.OWNER, ROLE.ADMIN]

export function ToggleRole(props: { role: ROLE, setRole: (role: ROLE) => void }) {
  const [isPending, startTransition] = useTransition();

  async function handleChangeRole(newRole: ROLE) {
    try {
      props.setRole(newRole);
      startTransition(async () => {
        const updatingRole = await updateRoleDocsFeature(newRole);
        if (updatingRole.status !== 200) {
          toast.error(updatingRole.message);
          props.setRole(props.role);
          return;
        }
        setTimeout(() => {
          window.location.reload()
        }, 300)
      })
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Try again later.')
      props.setRole(props.role);
    }
  }
  
  return (
    <div className='flex items-center gap-0.5 p-1.5 border border-border rounded-full shadow-black shadow-sm bg-background-sh'>
      {ROLES.map((r) => (
        <Button key={r} disabled={isPending} onClick={() => handleChangeRole(r)} size="sm" variant={r === props.role ? "tertiary" : "ghost"} className="rounded-full">
          {r.toLowerCase()}
        </Button>
      ))}
    </div>
  )
}