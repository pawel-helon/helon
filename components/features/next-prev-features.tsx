'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { getNextPrevFeaturesLinks } from "@/lib/helpers";

export function NextPrevFeatures() {
  const pathname = usePathname();
  const { prevFeatureLink, prevFeatureName, nextFeatureLink, nextFeatureName } = getNextPrevFeaturesLinks(pathname);

  return (
    <div className='flex gap-1'>
      <div role="tooltip" aria-label={`Go to ${prevFeatureName} feature`}>
        <TooltipProvider delayDuration={350}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={prevFeatureLink}>
                <Button size='icon' variant='outline' className='rounded-full'>
                  <ChevronLeft size={18} />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={24} className="rounded-full text-xs">
              {prevFeatureName}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div role="tooltip" aria-label={`Go to ${nextFeatureName} feature`}>
        <TooltipProvider delayDuration={350}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={nextFeatureLink}>
                <Button size='icon' variant='outline' className='rounded-full'>
                  <ChevronRight size={18} />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={24} className="rounded-full text-xs">
              {nextFeatureName}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
  
}