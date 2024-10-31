"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { skipOnboarding, updateAddDevice } from "@/actions/database-actions";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography";

export function OnboardingAddDevice(props: { onboardingID: string }) {
  const router = useRouter();

  async function handleSkipOnboarding() {
    try {
      const skippingOnboarding = await skipOnboarding(props.onboardingID)
      if (skippingOnboarding.status !== 200) {
        toast.error(skippingOnboarding.message)
        return;
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Try again later.")
    }
  }

  async function handleGotIt() {
    try {
      const updatingAddDevice = await updateAddDevice(props.onboardingID)
      if (updatingAddDevice.status !== 200) {
        toast.error(updatingAddDevice.message)
        return;
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Try again later.")
    }
  }

  return (
    <div className="w-[300px] h-min z-50 absolute bottom-[72px] xs:top-[72px] right-3 xs:right-0 flex flex-col p-2 gap-4 rounded-sm border border-border bg-background shadow-black shadow-md">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Text variant="p-base-thin" className="text-foreground">
            Guided Tour
          </Text>
          <BookOpen size={16} />
        </div>
        <Text variant="p-small-thin" className="text-muted-foreground">
          <span className="text-foreground">1</span>/5
        </Text>
      </div>
      <div className="flex flex-col gap-2">
        <Text variant="p-small-thin" className="mr-4">
          Here, you can add new device.
        </Text>
      </div>
      <div className="w-full flex justify-end gap-1">
        <Button onClick={handleSkipOnboarding} type="button" size="sm" variant="ghost">
          Skip tour
        </Button>
        <Button onClick={handleGotIt} type="button" size="sm">
          Got it
        </Button>
      </div>
    </div>
  );
}
