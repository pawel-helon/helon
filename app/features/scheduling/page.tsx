import { redirect } from "next/navigation";

export default async function SchedulingRootPage() {
  redirect('/features/scheduling/availability')
}