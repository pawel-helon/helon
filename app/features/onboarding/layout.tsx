import { BookOpenText, UsersRound, Vault } from "lucide-react";
import { FaQuestion } from "react-icons/fa";
import { GoBellFill } from "react-icons/go";
import { Account } from "@/components/features/onboarding/account";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { OnboardingDemo } from "@prisma/client";
import { getOnboarding } from "@/actions/server-actions";
import { OnboardingTabs } from "@/components/features/onboarding/onboarding-tabs";
import { OnboardingDocs } from "@/components/features/onboarding/onboarding-docs";
import { GuideEnd } from "@/components/features/onboarding/guide-end";

function showOnboarding(data: OnboardingDemo) {
  let showAddDevice = false;
  if (data.addDeviceCompleted === false) {
    showAddDevice = true
  }
  let showAccount = false;
  if (data.addDeviceCompleted === true && data.accountCompleted === false) {
    showAccount = true;
  }
  let showTabs = false;
  if (data.accountCompleted === true && data.tabsCompleted === false) {
    showTabs = true;
  }
  let showDocs = false;
  if (data.tabsCompleted === true && data.docsCompleted === false) {
    showDocs = true;
  }
  let showGuideEnd = false;
  if (data.docsCompleted === true && data.guideCompleted === false) {
    showGuideEnd = true;
  }
  return { showAddDevice, showAccount, showTabs, showDocs, showGuideEnd };
}

export default async function OnboardingLayout(props: {
  params: {
    onboardingID: string
  };
  children: React.ReactNode;
}) {
  const gettingOnboarding = await getOnboarding(props.params.onboardingID);
  const data = gettingOnboarding.onboarding as OnboardingDemo;
  const { showAccount, showTabs, showDocs, showGuideEnd } = showOnboarding(data); 

  return (
    <>
      {showGuideEnd && <GuideEnd onboardingID={gettingOnboarding.onboarding!.id} />}
      <div className="xs:hidden fixed top-0 left-3 right-3 z-50 flex justify-between pt-3 pb-2 bg-background">
        <div className="flex gap-1">
          <div className="relative">
            <Button size="icon" className="relative rounded-full bg-primary hover:bg-primary/90">
              <Vault size={20}/>
              {showTabs && (
                <div className="absolute -bottom-[8px] -right-[8px] flex p-1 bg-secondary rounded-full shadow-sm shadow-black">
                  <BookOpenText size={16} />
                </div>
              )}
            </Button>
            {showTabs && <OnboardingTabs onboardingID={gettingOnboarding.onboarding!.id} />}
          </div>
          <Button size="icon" className="relative rounded-full bg-border/80 hover:bg-border/60">
            <UsersRound size={20}/>
          </Button>
        </div>
        <Account showAccount={showAccount} showDocs={showDocs} onboardingID={gettingOnboarding.onboarding!.id} />
      </div>
      <div className="z-20 hidden xs:flex flex-col fixed h-screen justify-between p-2 pt-24 border-l-[1px] border-r-[1px] border-border">
        <div className="flex flex-col gap-2">
          <TooltipProvider delayDuration={350}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Button size="icon" className="relative rounded-full bg-primary hover:bg-primary/90">
                    <Vault size={20}/>
                    {showTabs && (
                      <div className="absolute bottom-[20px] -right-[8px] flex p-1 bg-secondary rounded-full shadow-sm shadow-black">
                        <BookOpenText size={16} />
                      </div>
                    )}
                  </Button>
                  {showTabs && <OnboardingTabs onboardingID={gettingOnboarding.onboarding!.id} />}
                </div>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={350}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="relative rounded-full bg-border/80 hover:bg-border/60">
                  <UsersRound size={20}/>
                </Button>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-col gap-2">
          <>
            <Button size="icon" variant="outline" className="relative rounded-full hover:bg-muted size-9 p-0">
              <FaQuestion />
              {showDocs && (
                <div className="absolute -bottom-[8px] xs:bottom-[20px] -right-[8px] flex p-1 bg-secondary rounded-full shadow-sm shadow-black">
                  <BookOpenText size={16} />
                </div>
              )}
            </Button>
            {showDocs && <OnboardingDocs onboardingID={gettingOnboarding.onboarding!.id} />}
          </>
          <Button size="icon" variant="outline" className="relative rounded-full hover:bg-muted min-w-9 size-9 p-0">
            <GoBellFill size={18}/>
          </Button>
          <Account showAccount={showAccount} onboardingID={gettingOnboarding.onboarding!.id} />
        </div>
      </div>
      <div className="w-full max-h-[100vh] xs:ml-[52px] pl-3 pr-2 xs:pl-6 xs:pr-5 xs:border-r-[1px] border-border overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
        {props.children}
      </div>
    </>
    
  )
}