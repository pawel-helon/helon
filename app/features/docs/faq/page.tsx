import { getRole } from "@/actions/server-actions";
import { ActionsDocs } from "@/components/features/docs/actions-docs";
import { AdminFAQ } from "@/components/features/docs/admin-faq";
import { EndUserFAQ } from "@/components/features/docs/end-user-faq"
import { OwnerFAQ } from "@/components/features/docs/owner-faq"
import { ROLE } from "@prisma/client"

const gettingRole = async () => {
  const gettingRole = await getRole();
  const role = gettingRole.role as ROLE;
  return role;
}

export default async function FAQPage() {
  const role = await gettingRole();
  const accordion = role === ROLE.ADMIN ? <AdminFAQ /> : role === ROLE.OWNER ? <OwnerFAQ /> : <EndUserFAQ />;
  return (
    <>
      <ActionsDocs role={role} />
      {accordion}
    </>
  )
}