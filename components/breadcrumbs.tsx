"use client"

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMedia } from 'react-use';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
 
export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const [parentID, setParentID] = useState<string>('');
  const isDesktop = useMedia('(min-width: 480px)', false);

  useEffect(() => {
    const parentElement = document.getElementById("meetings");
    if (parentElement) {
      setParentID(parentElement.id)
    } 
  },[setParentID])

  return (
    <>
      {isDesktop && (
        <>
          <Breadcrumb className="sticky z-20 top-0 left-0 right-0 flex items-center pt-4 pb-1 bg-background-sh">
            <BreadcrumbList>
              {parentID === "meetings" ? (
                <>
                  {segments
                    .filter((s, i) => i !== segments.length - 1 && i !== segments.length - 2)
                    .map((s, i) => {
                      let j: number = 0;
                      let href: string = "/";
                      for (j = 0; j <= i; j++) {
                        href = href + "/" + segments[j];
                      }
                      return (
                        <div key={s} className="flex items-center gap-2.5">
                          <BreadcrumbItem>
                            <BreadcrumbLink href={href}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                          {i !== 0 && <BreadcrumbSeparator />}
                        </div>
                      )
                    })
                  }
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/scheduling/meetings-temp/${segments[segments.length - 2]}/monday`}>
                      {`${segments[segments.length - 2].split('-')[1].charAt(0).toUpperCase() + segments[segments.length - 2].split('-')[1].slice(1)} ${segments[segments.length - 2].split('-')[2]}`}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="text-foreground-h">
                    <BreadcrumbPage>
                      {`${segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1)}`}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : (
                <>
                  {segments
                    .filter((s, i) => i !== segments.length - 1)
                    .map((s, i) => {
                      let j: number = 0;
                      let href: string = "/";
                      for (j = 0; j <= i; j++) {
                        href = href + segments[j];
                      }
                      return (
                        <BreadcrumbItem key={s} className="flex items-center gap-2.5">
                          <BreadcrumbLink href={href}>
                            {s}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      )
                    })
                  }
                  <BreadcrumbItem className="text-foreground-h">
                    <BreadcrumbPage>
                      {`${segments[segments.length - 1].split('-')[1].charAt(0).toUpperCase() + segments[segments.length - 1].split('-')[1].slice(1)} ${segments[segments.length - 1].split('-')[2]}`}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </>
      )}
    </>
  )
}