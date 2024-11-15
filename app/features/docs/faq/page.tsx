"use client"

import { useEffect, useState } from "react";
import { getRole } from "@/actions/server-actions";
import { AdminFAQ } from "@/components/features/docs/admin-faq";
import { EndUserFAQ } from "@/components/features/docs/end-user-faq"
import { OwnerFAQ } from "@/components/features/docs/owner-faq"
import { ROLE } from "@prisma/client"

export default function FAQPage() {
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
  
  const accordion = role === ROLE.ADMIN ? <AdminFAQ /> : role === ROLE.OWNER ? <OwnerFAQ /> : <EndUserFAQ />;
  return accordion;
}
