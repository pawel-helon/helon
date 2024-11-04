"use client";

import { BookOpen } from "lucide-react";
import { Text } from "@/components/typography";
import { Button } from "@/components/ui/button";

export function OnboardingAddDevice(props: {
  onboardingStep: number,
  nextStep: () => void,
  skipTour: () => void
}) {
  if (props.onboardingStep !== 1) return null;
  return (
    <div className="w-[300px] h-min z-50 absolute bottom-[72px] xs:top-[72px] right-3 xs:right-0 flex flex-col p-2 gap-4 rounded-sm border border-border shadow-black shadow-md bg-background-sh">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Text variant="p-base-thin" className="text-foreground">
            Guided Tour
          </Text>
          <BookOpen size={16} />
        </div>
        <Text variant="p-small-thin" className="text-muted-foreground">
          <span className="text-foreground">{props.onboardingStep}</span>/5
        </Text>
      </div>
      <div className="flex flex-col gap-2">
        <Text variant="p-small-thin" className="mr-4">
          Here, you can add new device.
        </Text>
      </div>
      <div className="w-full flex justify-end gap-1">
        <Button onClick={props.skipTour} type="button" size="sm" variant="ghost" aria-label="Skip tour">
          Skip tour
        </Button>
        <Button onClick={props.nextStep} type="button" size="sm" aria-label="Go to the next tip">
          Got it
        </Button>
      </div>
    </div>
  );
}
