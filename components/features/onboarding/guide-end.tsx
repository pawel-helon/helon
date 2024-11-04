"use client"

import { useMedia } from "react-use";
import { BookOpenText } from "lucide-react";
import { Text } from "@/components/typography";
import { Sheet, SheetContentOnboarding as SheetContent, SheetTitleH as SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContentWithoutClose as DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function GuideEnd(props: {
  onboardingStep: number,
  skipTour: () => void
}) {
  const isMobile = useMedia("(max-width: 480px)", false);
  if (props.onboardingStep !== 5) return null;
  return (
    <>
      {isMobile ? (
        <Sheet open={true}>
          <SheetContent side="bottom" className="h-[280px] bg-background-sh" aria-describedby="">
            <div className="flex justify-center items-center p-3 gap-4 mb-8">
              <SheetTitle className="text-center">Guided Tour</SheetTitle>
              <BookOpenText size={18} className="text-muted-foreground"/>
            </div>
            <div className="w-full flex flex-col gap-8">
              <Text variant="p-base-thin" className="text-center">
                You are all set. Thank you for taking time to get familiar with our platform.
              </Text>
            </div>
            <div className="w-full absolute left-0 right-0 bottom-0 flex p-3">
              <Button onClick={props.skipTour} className="w-full" aria-label="Finish onboarding guide">
                Finish
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true}>
          <DialogContent aria-describedby="" className="min-h-[300px] min-w-[600px] flex flex-col justify-start bg-background-sh">
            <div className="flex justify-between items-start mb-16">
              <DialogTitle>Guided Tour</DialogTitle>
              <BookOpenText size={18} className="text-muted-foreground"/>
            </div>
            <div className="w-full flex flex-col gap-8 mb-15">
              <Text variant="p-base-thin">
                You are all set. Thank you for taking time to get familiar with our platform.
              </Text>
            </div>
            <div className="w-full absolute left-0 right-0 bottom-0 flex justify-end p-6">
              <Button onClick={props.skipTour} aria-label="Finish onboarding guide">
                Finish
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}