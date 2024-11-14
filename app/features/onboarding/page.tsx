"use client"

import { useState } from "react";
import { BookOpenText, UsersRound, Vault, Plus, TrendingUp } from "lucide-react";
import { FaQuestion } from "react-icons/fa";
import { GoBellFill } from "react-icons/go";
import { useMedia } from "react-use";
import { ActionsOnboarding } from "@/components/features/onboarding/actions-docs";
import { OnboardingAddDevice } from "@/components/features/onboarding/onboarding-add-device";
import { OnboardingAccount } from "@/components/features/onboarding/onboarding-account";
import { OnboardingTabs } from "@/components/features/onboarding/onboarding-tabs";
import { OnboardingDocs } from "@/components/features/onboarding/onboarding-docs";
import { GuideEnd } from "@/components/features/onboarding/guide-end";
import { Text } from "@/components/typography";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DisabledAction } from "@/components/disabled-action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

function useOnboarding() {
  const TOTAL_STEPS = 5;
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const nextStep = () => setOnboardingStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const skipTour = () => setOnboardingStep(TOTAL_STEPS + 1);
  const restart = () => setOnboardingStep(1);
  return { onboardingStep, nextStep, skipTour, restart };
}

export default function OnboardingPage() {
  const { onboardingStep, nextStep, skipTour, restart } = useOnboarding();
  const isMobile = useMedia("(max-width: 480px)", false);
  return (
    <>
      <ActionsOnboarding restart={restart} />
      {onboardingStep === 5 && <GuideEnd onboardingStep={onboardingStep} skipTour={skipTour}/>}
      <div className="xs:hidden fixed top-0 left-3 right-3 z-50 flex justify-between pt-3 pb-2 bg-background">
        <div className="flex gap-1">
          <div className="relative">
            <DisabledAction side="bottom" sideOffset={8} align="start">
              <Button size="icon" className="relative rounded-full bg-primary hover:bg-primary/90" aria-label="Open devices tab">
                <Vault size={20}/>
                {onboardingStep === 3 && (
                  <div className="absolute -bottom-[8px] -right-[8px] flex p-1 bg-secondary rounded-full shadow-sm shadow-black">
                    <BookOpenText size={16} />
                  </div>
                )}
              </Button>
            </DisabledAction>
            <OnboardingTabs onboardingStep={onboardingStep} nextStep={nextStep} skipTour={skipTour} />
          </div>
          <DisabledAction side="bottom" sideOffset={8} align="start">
            <Button size="icon" className="relative rounded-full bg-border/80 hover:bg-border/60" aria-label="Open users tab">
              <UsersRound size={20}/>
            </Button>
          </DisabledAction>
        </div>
        <div className="relative">
          <DisabledAction side="bottom" sideOffset={8} align="end">
            <div className="relative">
              <Avatar className="xs:size-9 hover:cursor-pointer">
                <AvatarImage src="/avatar.png" alt="user avatar" className="xs:size-9" />
              </Avatar>
              {(onboardingStep === 2 || (isMobile && onboardingStep === 4)) && (
                <div className="absolute -bottom-[8px] xs:bottom-[20px] -right-[8px] flex p-1 bg-secondary rounded-full shadow-sm shadow-black">
                  <BookOpenText size={16} />
                </div>
              )}
            </div>
          </DisabledAction>
          <OnboardingAccount onboardingStep={onboardingStep} nextStep={nextStep} skipTour={skipTour} />
          <OnboardingDocs onboardingStep={onboardingStep} nextStep={nextStep} skipTour={skipTour} />
        </div>
      </div>
      <div className="z-20 hidden xs:flex flex-col fixed h-screen justify-between p-2 pt-24 border-l-[1px] border-r-[1px] border-border">
        <div className="flex flex-col gap-2">
          <div className="relative">
            <DisabledAction side="right" sideOffset={12}>
              <Button size="icon" className="relative rounded-full bg-primary hover:bg-primary/90" aria-label="Open devices tab">
                <Vault size={20}/>
                {onboardingStep === 3 && (
                  <div className="absolute bottom-[20px] -right-[8px] flex p-1 bg-secondary rounded-full shadow-sm shadow-black">
                    <BookOpenText size={16} />
                  </div>
                )}
              </Button>
            </DisabledAction>
            <OnboardingTabs onboardingStep={onboardingStep} nextStep={nextStep} skipTour={skipTour} />
          </div>
          <DisabledAction side="right" sideOffset={12}>
            <Button size="icon" className="relative rounded-full bg-border/80 hover:bg-border/60" aria-label="Open users tab">
              <UsersRound size={20}/>
            </Button>
          </DisabledAction>
        </div>
        <div className="flex flex-col gap-2">
          <DisabledAction side="right" sideOffset={12}>
            <Button size="icon" variant="outline" className="relative rounded-full hover:bg-muted size-9 p-0" aria-label="Open documentation">
              <FaQuestion />
              {onboardingStep === 4 && (
                <div className="absolute -bottom-[8px] xs:bottom-[20px] -right-[8px] flex p-1 bg-secondary rounded-full shadow-sm shadow-black">
                  <BookOpenText size={16} />
                </div>
              )}
            </Button>
          </DisabledAction>
          <OnboardingDocs onboardingStep={onboardingStep} nextStep={nextStep} skipTour={skipTour} />
          <DisabledAction side="right" sideOffset={12}>
            <Button size="icon" variant="outline" className="relative rounded-full hover:bg-muted min-w-9 size-9 p-0" aria-label="Open notifications">
              <GoBellFill size={18}/>
            </Button>
          </DisabledAction>
          <div className="relative">
            <DisabledAction side="right" sideOffset={12}>
              <Avatar className="xs:size-9 hover:cursor-pointer">
                <AvatarImage src="/avatar.png" alt="user avatar" className="xs:size-9" />
              </Avatar>
            </DisabledAction>
            {(onboardingStep === 2 || (isMobile && onboardingStep === 4)) && (
              <div className="absolute -bottom-[8px] xs:bottom-[20px] -right-[8px] flex p-1 bg-secondary rounded-full shadow-sm shadow-black">
                <BookOpenText size={16} />
              </div>
            )}
          </div>
          <OnboardingAccount onboardingStep={onboardingStep} nextStep={nextStep} skipTour={skipTour} />
        </div>
      </div>
      <div className="w-full max-h-[100vh] xs:ml-[52px] pl-3 pr-2 xs:pl-6 xs:pr-5 xs:border-r-[1px] border-border overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
        <div className="mb-16">
          <div className="hidden h-[60px] sticky z-20 top-0 left-0 right-0 xs:flex justify-between items-center bg-background-sh">
            <Breadcrumb aria-label="Breadcrumb">
              <BreadcrumbList>
                <BreadcrumbLink>
                  Devices
                </BreadcrumbLink>
              </BreadcrumbList>
            </Breadcrumb>
            <DisabledAction side="left" sideOffset={8} align="end">
              <Button className="relative" aria-label="Open add device form">
                <Plus className="-ml-2 mr-2 size-4"/>
                Add device
                {onboardingStep === 1 && (
                  <div className="absolute -bottom-[8px] -right-[8px] flex p-1 bg-secondary rounded-full shadow-sm shadow-black">
                    <BookOpenText size={16} />
                  </div>
                )}
              </Button>
            </DisabledAction>
            <OnboardingAddDevice onboardingStep={onboardingStep} nextStep={nextStep} skipTour={skipTour} />
          </div>
          <div className="xs:hidden">
            <DisabledAction side="top" sideOffset={8} align="end">
              <Button className="fixed bottom-3 right-3 z-20 size-11 p-0 rounded-full" aria-label="Open add device form">
                <Plus />
                  {onboardingStep === 1 && (
                    <div className="absolute -top-[8px] -right-[8px] flex p-1 bg-secondary rounded-full shadow-sm shadow-black">
                      <BookOpenText size={16} />
                    </div>
                  )}
              </Button>
            </DisabledAction>
            <OnboardingAddDevice onboardingStep={onboardingStep} nextStep={nextStep} skipTour={skipTour} />
          </div>
          <div className="flex items-start my-[4rem] gap-2">
            <Text variant="h1">Devices</Text>
            <DisabledAction side={isMobile ? "bottom" : "right"} sideOffset={isMobile ? 12 : 8} align={isMobile ? "center" : "start"}>
              <Button variant="outline" className="h-min p-1 rounded-full" aria-label="Open statistics page">
                <TrendingUp size={18} />
              </Button>
            </DisabledAction>
          </div>
          <div className="h-11 mb-8 flex border-b border-border" />
          <div className="h-[30vh] flex flex-col justify-center items-center gap-4 border border-border shadow-black shadow-2xl rounded-lg bg-background">
            <Text variant="p-small-thin" className="max-w-[40ch] text-center text-muted-foreground">
              No devices have been added yet.
            </Text>
            <DisabledAction side="bottom" sideOffset={8} align="center">
              <Button variant="outline" size="sm" aria-label="Open add device form">
                <Plus className="size-4 -ml-2 mr-2" />
                Add device
              </Button>
            </DisabledAction>
          </div>
        </div>
      </div>
    </>
  )
}
