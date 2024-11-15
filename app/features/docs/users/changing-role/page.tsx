import { redirect } from "next/navigation";
import { getRole } from "@/actions/server-actions";
import { Text } from "@/components/typography";
import { ROLE } from "@prisma/client";

export default async function ChangingRoleDocPage() {
  const gettingRole = await getRole();
  if (!gettingRole) return;
  const role = gettingRole.role as ROLE;
  
  if (role === ROLE.ADMIN) {
    return (
      <div className="h-min col-span-3 flex flex-col gap-4 p-4 pb-6 text-card-foreground border border-border rounded-lg bg-background shadow-black shadow-2xl">
        <Text variant="h3">How to change role of a user?</Text>
        <Text variant="p-base-thin" className="leading-normal">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </Text>
      </div>
    )
  } else {
    redirect("/docs/faq")
  }
}