import { redirect } from "next/navigation";

export default async function FeaturesRootPage() {
  redirect(`/features/auth`);
}