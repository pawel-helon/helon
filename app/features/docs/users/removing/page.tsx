"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRole } from "@/actions/server-actions";
import { Text } from "@/components/typography";
import { ROLE } from "@prisma/client";

export default function RemovingUserDocPage() {
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
  if (role === ROLE.ADMIN) {
    return (
      <div className="h-min col-span-3 flex flex-col gap-4 p-4 pb-6 text-card-foreground border border-border rounded-lg bg-background shadow-black shadow-2xl">
        <Text variant="h3">How to remove user?</Text>
        <div className="space-y-2">
          <Text variant="p-base-thin" className="leading-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </Text>
          <Text variant="p-base-thin" className="leading-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </Text>
        </div>
      </div>
    )
  } else {
    router.push("/docs/faq")
  }
}
