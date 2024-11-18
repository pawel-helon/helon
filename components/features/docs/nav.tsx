"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Text } from "@/components/typography";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ROLE } from "@prisma/client";


function getDropdownLabel(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  let dropdownLabel = "";
  
  if (pathname === "/features/docs/faq") {
    dropdownLabel = "Frequently asked questions"
  } else {
    dropdownLabel = segments[segments.length - 1].split("-").join(" ").charAt(0).toUpperCase() + segments[segments.length - 1].split("-").join(" ").slice(1);
  }
  return dropdownLabel;
}

const DEVICES_LINKS = [
  { title: "Adding", link: "/features/docs/devices/adding-new-device" },
  { title: "Assigning new owner", link: "/features/docs/devices/reassigning-owner" },
  { title: "Giving access", link: "/features/docs/devices/giving-access" },
  { title: "Disabling", link: "/features/docs/devices/disabling" },
  { title: "Activate and deactivate", link: "/features/docs/devices/activate-and-deactivate" },
  { title: "Removing", link: "/features/docs/devices/removing" },
]

const USERS_LINKS = [
  { title: "Adding", link: "/features/docs/users/adding-new-user" },
  { title: "Changing role", link: "/features/docs/users/changing-role" },
  { title: "Removing", link: "/features/docs/users/removing" },
]
const ADMIN_LINKS = { DEVICES_LINKS, USERS_LINKS }

const OWNER_LINKS = [
  { title: "Giving access", link: "/features/docs/devices/giving-access" },
  { title: "Disabling", link: "/features/docs/devices/disabling" },
  { title: "Activate and deactivate", link: "/features/docs/devices/activate-and-deactivate" },
  { title: "Removing", link: "/features/docs/devices/removing" },
]

const ENDUSER_LINKS = [
  { title: "Removing device", link: "/features/docs/devices/removing" },
]

function getLinks(role: ROLE) {
  let links = [];
  return role === ROLE.ADMIN ? links = ADMIN_LINKS.DEVICES_LINKS : role === ROLE.OWNER ? links = OWNER_LINKS : ENDUSER_LINKS
}

export function Nav(props: { role: ROLE }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownLabel = getDropdownLabel(pathname);
  const LINKS = getLinks(props.role)

  return (
    <>
      <div className="md:hidden w-full flex justify-end">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex justify-between items-center gap-1 pr-1">
              {dropdownLabel}
              <ChevronDown size={20}/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-fit flex flex-col gap-1 py-2 bg-background-sh shadow-black shadow-md">
            {props.role === ROLE.ADMIN && <Text variant="p-small-thick" className="text-muted-foreground my-2 ml-2">DEVICES</Text>}
            {LINKS.map((i) => (
              <Link key={i.link} href={i.link} prefetch={true}>
                <Button onClick={() => setOpen(!open)} variant="ghost" size="sm" className="w-full justify-start pl-2">
                  {i.title}
                </Button>
              </Link>
            ))}
            {props.role === ROLE.ADMIN && (
              <>
                <Separator className="my-2"/>
                <Text variant="p-small-thick" className="text-muted-foreground my-2 ml-2">USERS</Text>
                {ADMIN_LINKS.USERS_LINKS.map((i) => (
                  <Link key={i.link} href={i.link} prefetch={true}>
                    <Button onClick={() => setOpen(!open)} variant="ghost" size="sm" className="w-full justify-start pl-2">
                      {i.title}
                    </Button>
                  </Link>
                ))}
              </>
            )}
            <Separator className="my-2"/>
            <Link href="/features/docs/faq" prefetch={true}>
              <Button onClick={() => setOpen(!open)} variant="ghost" size="sm" className="w-full justify-start pl-2">
                Frequently asked questions
              </Button>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="h-min hidden md:col-span-1 md:flex flex-col gap-4 px-2 py-4 text-card-foreground border border-border rounded-lg bg-background shadow-black shadow-2xl">
        <div className="space-y-1.5">
          {props.role === ROLE.ADMIN && <Text variant="p-small-thick" className="text-muted-foreground mb-2 ml-2">DEVICES</Text> }
          <ul className="space-y-1">
            {LINKS!.map((i) => (
              <li key={i.link} className={cn(
                "cursor-default hover:bg-accent/60 flex select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                pathname === i.link && "bg-primary hover:bg-primary/80 text-accent-foreground"
              )}>
                <Link href={i.link} prefetch={true} >{i.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        {props.role === ROLE.ADMIN && (
          <>
            <Separator className="mb-1"/>
            <div className="space-y-1.5">
              <Text variant="p-small-thick" className="text-muted-foreground mb-2 ml-2">USERS</Text>
              <ul className="space-y-1">
                {ADMIN_LINKS.USERS_LINKS.map((i) => (
                  <li key={i.link} className={cn(
                    "cursor-default hover:bg-accent/60 flex select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    pathname === i.link && "bg-primary text-accent-foreground"
                  )}>
                    <Link href={i.link} prefetch={true}>{i.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        <Separator />
        <li className={cn(
          "cursor-default hover:bg-accent/60 flex select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          pathname === "/features/docs/faq" && "bg-primary text-accent-foreground"
        )}>
          <Link href="/features/docs/faq" prefetch={true}>Frequently asked questions</Link>
        </li>
      </div>
    </>
  );
}
