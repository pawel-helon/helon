import { BookOpenText, Plus, TrendingUp } from "lucide-react";
import { getOnboarding } from "@/actions/server-actions";
import { Text } from "@/components/typography";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { OnboardingDemo } from "@prisma/client";
import { OnboardingAddDevice } from "@/components/features/onboarding/onboarding-add-device";

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

export default async function OnboardingPage(props: { params: { onboardingID: string }}) {
  const gettingOnboarding = await getOnboarding(props.params.onboardingID);
  const data = gettingOnboarding.onboarding as OnboardingDemo;
  const { showAddDevice } = showOnboarding(data); 

  return (
    <div className="mb-16">
      <div className="hidden h-[60px] sticky z-20 top-0 left-0 right-0 xs:flex justify-between items-center bg-background-sh">
        <Breadcrumb aria-label="Breadcrumb">
          <BreadcrumbList>
            <BreadcrumbLink>
              Devices
            </BreadcrumbLink>
          </BreadcrumbList>
        </Breadcrumb>
        <>
          <Button className="relative">
            <Plus className="-ml-2 mr-2 size-4"/>
            Add device
            {showAddDevice && (
              <div className="absolute -bottom-[8px] -right-[8px] flex p-1 bg-secondary rounded-full shadow-sm shadow-black">
                <BookOpenText size={16} />
              </div>
            )}
          </Button>
          {showAddDevice === true && <OnboardingAddDevice onboardingID={props.params.onboardingID} />}
        </>
      </div>
      <div className="xs:hidden">
        <Button className="fixed bottom-3 right-3 z-20 size-11 p-0 rounded-full">
         <Plus />
          {showAddDevice && (
            <div className="absolute -top-[8px] -right-[8px] flex p-1 bg-secondary rounded-full shadow-sm shadow-black">
              <BookOpenText size={16} />
            </div>
          )}
        </Button>
        {showAddDevice && <OnboardingAddDevice onboardingID={props.params.onboardingID} />}
      </div>
      <div className="flex items-start my-[4rem] gap-2">
        <Text variant="h1">Devices</Text>
        <Button variant="outline" className="h-min p-1 rounded-full">
          <TrendingUp size={18} />
        </Button>
      </div>
      <div className="h-11 mb-8 flex border-b border-border" />
      <div className="h-[30vh] flex flex-col justify-center items-center gap-4 border border-border shadow-black shadow-2xl rounded-lg bg-background">
        <Text variant="p-small-thin" className="max-w-[40ch] text-center text-muted-foreground">
          No devices have been added yet.
        </Text>
        <Button variant="outline" size="sm">
          <Plus className="size-4 -ml-2 mr-2" />
          Add device
        </Button>
      </div>
    </div>
  )
} 