"use client"

import { updateRoleDocsFeature } from "@/actions/database-actions";
import { ROLE } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function Temp() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleChangeRole(newRole: ROLE) {
    try {
      startTransition(async () => {
        const updatingRole = await updateRoleDocsFeature(newRole);
        if (updatingRole.status !== 200) {
          toast.error(updatingRole.message);
          return;
        }
        router.refresh()
      })
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Try again later.')
    }
  }
  
  return (
    <>
      <Button onClick={() => handleChangeRole(ROLE.ADMIN)}>
        Admin
      </Button>
      <Button onClick={() => handleChangeRole(ROLE.OWNER)}>
        Owner
      </Button>
      <Button onClick={() => handleChangeRole(ROLE.ENDUSER)}>
        End user
      </Button>
    </>
  )
}