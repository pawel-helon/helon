"use client"

import { usePathname } from "next/navigation";
import { capitalizeFirstLetter, constructUrl } from "@/lib/helpers";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    // Desktop breakpoint
    <Breadcrumb className="hidden xs:flex sticky z-20 top-0 left-0 right-0 items-center pt-4 pb-1 bg-background-sh" aria-label="Breadcrumb">
      <BreadcrumbList>
        {segments.slice(0, -1).map((segment, index) => (
          <BreadcrumbItem key={segment} className="flex items-center gap-2.5">
            <BreadcrumbLink href={constructUrl(segments, index)}>
              {capitalizeFirstLetter(segment)}
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
        ))}
        <BreadcrumbItem className="text-foreground-h">
          <BreadcrumbPage>
            {`${capitalizeFirstLetter(segments[segments.length - 1].split('-')[1])} ${segments[segments.length - 1].split('-')[2]}`}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}