"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useMedia } from "react-use";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function constructUrl(segments: string[], index: number) {
  return "/" + segments.slice(0, index + 1).join("/");
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const [parentID, setParentID] = useState<string>("");
  const isDesktop = useMedia("(min-width: 480px)", false);

  useEffect(() => {
    const parentElement = document.getElementById("meetings");
    if (parentElement) {
      setParentID(parentElement.id)
    } 
  },[])

  if (!isDesktop) return null;

  return (
    <Breadcrumb className="sticky z-20 top-0 left-0 right-0 flex items-center pt-4 pb-1 bg-background-sh" aria-label="Breadcrumb">
      <BreadcrumbList>
        {parentID === "meetings" ? (
          <>
            {segments.slice(0, -2).map((segment, index) => (
              <BreadcrumbItem key={segment} className="flex items-center gap-2.5">
                <BreadcrumbLink href={constructUrl(segments, index)}>
                  {capitalizeFirstLetter(segment)}
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
            ))}
            <BreadcrumbItem>
              <BreadcrumbLink href={`/scheduling/meetings/${segments[segments.length - 2]}/monday`}>
                {`${capitalizeFirstLetter(segments[segments.length - 2].split('-')[1])} ${segments[segments.length - 2].split('-')[2]}`}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-foreground-h">
              <BreadcrumbPage>
                {capitalizeFirstLetter(segments[segments.length - 1])}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <>
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
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}