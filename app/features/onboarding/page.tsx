import { redirect } from "next/navigation";

export default async function OnboardingRootPage(props: { params: { onboardingID: string } }) {
  redirect(`/features/onboarding/${props.params.onboardingID}`)
} 