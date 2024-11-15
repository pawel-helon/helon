import { getRole } from "@/actions/server-actions";
import { AdminFAQ } from "@/components/features/docs/admin-faq";
import { EndUserFAQ } from "@/components/features/docs/end-user-faq"
import { OwnerFAQ } from "@/components/features/docs/owner-faq"
import { ROLE } from "@prisma/client"

export default async function FAQPage() {
  const gettingRole = await getRole();
  if (!gettingRole) return;
  const role = gettingRole.role as ROLE;
  
  const accordion = role === ROLE.ADMIN ? <AdminFAQ /> : role === ROLE.OWNER ? <OwnerFAQ /> : <EndUserFAQ />;
  return accordion;
}