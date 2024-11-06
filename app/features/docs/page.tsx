import { UsersRound, Vault, Plus, TrendingUp } from "lucide-react";
import { FaQuestion } from "react-icons/fa";
import { GoBellFill } from "react-icons/go";
import { Text } from "@/components/typography";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ROLE } from "@prisma/client";
import { Account } from "@/components/features/docs/account";
import { getRole } from "@/actions/server-actions";
import { ActionsDocs } from "@/components/features/docs/actions-docs";

export default async function DocsPage() {
  const gettingRole = await getRole();
  if (!gettingRole) return;
  const role = gettingRole.role as ROLE;

  return (
    <>
      <ActionsDocs role={role}/>
      <div className="xs:hidden fixed top-0 left-3 right-3 z-50 flex justify-between pt-3 pb-2 bg-background">
        <div className="flex gap-1">
          <div className="relative">
            <Button size="icon" className="relative rounded-full bg-primary hover:bg-primary/90" aria-label="Open devices tab">
              <Vault size={20}/>
            </Button>
          </div>
          <Button size="icon" className="relative rounded-full bg-border/80 hover:bg-border/60" aria-label="Open users tab">
            <UsersRound size={20}/>
          </Button>
        </div>
        <div className="relative">
          <Account />
        </div>
      </div>
      <div className="z-20 hidden xs:flex flex-col fixed h-screen justify-between p-2 pt-24 border-l-[1px] border-r-[1px] border-border">
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Button size="icon" className="relative rounded-full bg-primary hover:bg-primary/90" aria-label="Open devices tab">
              <Vault size={20}/>
                
            </Button>
          </div>
          <Button size="icon" className="relative rounded-full bg-border/80 hover:bg-border/60" aria-label="Open users tab">
            <UsersRound size={20}/>
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <>
            <Button size="icon" variant="outline" className="relative rounded-full hover:bg-muted size-9 p-0" aria-label="Open documentation">
              <FaQuestion />
            </Button>
          </>
          <Button size="icon" variant="outline" className="relative rounded-full hover:bg-muted min-w-9 size-9 p-0" aria-label="Open notifications">
            <GoBellFill size={18}/>
          </Button>
          <div className="relative">
            <Account />
          </div>
        </div>
      </div>
      <div className="w-full max-h-[100vh] xs:ml-[52px] pl-3 pr-2 xs:pl-6 xs:pr-5 xs:border-r-[1px] border-border overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
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
              <Button className="relative" aria-label="Open add device form">
                <Plus className="-ml-2 mr-2 size-4"/>
                Add device
              </Button>
            </>
          </div>
          <div className="xs:hidden">
            <Button className="fixed bottom-3 right-3 z-20 size-11 p-0 rounded-full" aria-label="Open add device form">
            <Plus />
            </Button>
          </div>
          <div className="flex items-start my-[4rem] gap-2">
            <Text variant="h1">Devices</Text>
            <Button variant="outline" className="h-min p-1 rounded-full" aria-label="Open statistics page">
              <TrendingUp size={18} />
            </Button>
          </div>
          <div className="h-11 mb-8 flex border-b border-border" />
          <div className="h-[30vh] flex flex-col justify-center items-center gap-4 border border-border shadow-black shadow-2xl rounded-lg bg-background">
            <Text variant="p-small-thin" className="max-w-[40ch] text-center text-muted-foreground">
              No devices have been added yet.
            </Text>
            <Button variant="outline" size="sm" aria-label="Open add device form">
              <Plus className="size-4 -ml-2 mr-2" />
              Add device
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
