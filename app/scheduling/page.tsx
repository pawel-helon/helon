import { redirect } from "next/navigation";

export default async function SchedulingRootPage() {
  redirect('/scheduling/availability')
}