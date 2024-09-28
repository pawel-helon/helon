"use client"

import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = () => {
    return pathname.split('/').filter(Boolean).map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));
  }
  
  return (
    <Breadcrumb className='sticky z-20 top-0 left-0 right-0 flex items-center pt-4 pb-1 bg-[#0a0a0a]'>
      <BreadcrumbList>
        {segments().slice(0, segments().length - 1).map((segment, index) => {
          return (
            <div key={index} className='flex items-center gap-2.5'>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${segments().slice(0, index + 1).join('/').toLowerCase()}`}>
                  {segment}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </div>
          )
        })}
        <BreadcrumbItem className='text-foreground-h'>
          <BreadcrumbPage>
            {`${segments()[segments().length - 1].split('-')[0]} ${segments()[segments().length - 1].split('-')[1]}`}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}