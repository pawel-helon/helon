'use client'

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FEATURES_LINKS = ['/features/auth','/features/forms','/features/tables','/features/charts','/features/qr-codes','/features/onboarding','/features/scheduling','/features/notifications','/features/docs']

const getNextPrevFeaturesLinks = (pathname: string) => {
  let prevFeatureLink: string = '';
  let nextFeatureLink: string = '';
  const currentFeatureLinkIndex = FEATURES_LINKS.indexOf(pathname)
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
  return {prevFeatureLink, nextFeatureLink }
} 

export function NextPrevFeatures() {
  const pathname = usePathname();
  const { prevFeatureLink, nextFeatureLink } = getNextPrevFeaturesLinks(pathname);

  console.log('prevFeatureLink: ', prevFeatureLink, 'nextFeatureLink: ', nextFeatureLink);

  return (
    <div className='flex gap-1'>
      <Link href={prevFeatureLink}>
        <Button size='icon' variant='outline' className='rounded-full'>
          <ChevronLeft size={18} />
        </Button>
      </Link>
      <Link href={nextFeatureLink}>
        <Button size='icon' variant='outline' className='rounded-full'>
          <ChevronRight size={18} />
        </Button>
      </Link>
    </div>
  )
  
}