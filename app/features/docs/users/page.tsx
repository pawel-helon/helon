"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRole } from "@/actions/server-actions";
import { ROLE } from "@prisma/client";

export default function DocsUsersPage() {
  const router = useRouter();
  const [role, setRole] = useState<ROLE>(ROLE.ENDUSER);

  useEffect(() => {
    async function init() {
      try {
        const gettingRole = await getRole();
        if (gettingRole.role) {
          setRole(gettingRole.role);
        }
      } catch (error) {
        console.error(error)
      }
    }
    init();
  }, [setRole])
  
  if (role !== ROLE.ADMIN) {
    router.push("/features/docs/devices/adding-new-device");
  } else {
    router.push("/features/docs/users/adding-new-user");
  }
}
