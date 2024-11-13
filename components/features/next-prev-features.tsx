'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const FEATURES_LINKS = ['/features/forms','/features/tables','/features/charts','/features/qr-codes','/features/onboarding','/features/scheduling','/features/notifications','/features/docs']

const getNextPrevFeaturesLinks = (pathname: string) => {
  let prevFeatureLink: string = '';
  let nextFeatureLink: string = '';
  let prevFeatureName: string = '';
  let nextFeatureName: string = '';
  
  const segments = pathname.split('/').filter(Boolean);
  const currentfeatureLink = `/${segments[0]}/${segments[1]}` ;
  const currentFeatureLinkIndex = FEATURES_LINKS.indexOf(currentfeatureLink);

  // getting links
  if (currentFeatureLinkIndex > 0) {
    prevFeatureLink = FEATURES_LINKS[currentFeatureLinkIndex - 1];
  } else {
    prevFeatureLink = FEATURES_LINKS[FEATURES_LINKS.length - 1];
  }

  if (currentFeatureLinkIndex < FEATURES_LINKS.length - 1 ) {
    nextFeatureLink = FEATURES_LINKS[currentFeatureLinkIndex + 1];
  } else {
    nextFeatureLink = FEATURES_LINKS[0];
  }

  // getting names
  if (prevFeatureLink !== '/features/qr-codes') {
    prevFeatureName = prevFeatureLink.split('/')[2].charAt(0).toLocaleUpperCase() + prevFeatureLink.split('/')[2].slice(1)
  } else {
    prevFeatureName = 'QR codes';
  }

  if (nextFeatureLink !== '/features/qr-codes') {
    nextFeatureName = nextFeatureLink.split('/')[2].charAt(0).toLocaleUpperCase() + nextFeatureLink.split('/')[2].slice(1)
  } else {
    nextFeatureName = 'QR codes';
  }
  
  return { prevFeatureLink, prevFeatureName, nextFeatureLink, nextFeatureName };
} 

export function NextPrevFeatures() {
  const pathname = usePathname();
  const { prevFeatureLink, prevFeatureName, nextFeatureLink, nextFeatureName } = getNextPrevFeaturesLinks(pathname);

  return (
    <div className='flex gap-1'>
      <TooltipProvider delayDuration={350}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={prevFeatureLink}>
              <Button size='icon' variant='outline' className='rounded-full'>
                <ChevronLeft size={18} />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={12} className="text-xs">
            {prevFeatureName}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider delayDuration={350}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={nextFeatureLink}>
              <Button size='icon' variant='outline' className='rounded-full'>
                <ChevronRight size={18} />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={12} className="text-xs">
            {nextFeatureName}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
  
}