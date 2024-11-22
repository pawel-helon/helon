import { UsersRound, Vault, Plus } from "lucide-react";
import { FaQuestion } from "react-icons/fa";
import { getNotifications } from "@/actions/server-actions";
import { ActionsNotifications } from "@/components/features/notifications/actions-notifications";
import { Account } from "@/components/features/notifications/account";
import { Notifications } from "@/components/features/notifications/notifications";
import { Text } from "@/components/typography";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Notification } from "@prisma/client";
import { DisabledAction } from "@/components/disabled-action";
import { Statistics } from "@/components/features/notifications/statistics";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

async function gettingNotifications() {
  const gettingNotifications = await getNotifications();  
  const notifications = gettingNotifications.notifications as Notification[];
  return { notifications }
}

export default async function NotificationsPage() {
  const { notifications } = await gettingNotifications()
  return (
    <>
      <ActionsNotifications />
      <div className="xs:hidden fixed top-0 left-3 right-3 z-50 flex justify-between pt-3 pb-2 bg-background">
        <div className="flex gap-1">
          <DisabledAction side="bottom" sideOffset={8} align="start">
            <Button size="icon" className="relative rounded-full bg-primary hover:bg-primary/90" aria-label="Open devices tab">
              <Vault size={20}/>
            </Button>
          </DisabledAction>
          <DisabledAction side="bottom" sideOffset={8} align="start">
            <Button size="icon" className="relative rounded-full bg-border/80 hover:bg-border/60" aria-label="Open users tab">
              <UsersRound size={20}/>
            </Button>
          </DisabledAction>
        </div>
        <Account notifications={notifications} />
      </div>
      <div className="z-20 hidden xs:flex flex-col fixed h-screen justify-between p-2 pt-24 border-l-[1px] border-r-[1px] border-border">
        <div className="flex flex-col gap-2">
          <DisabledAction side="right" sideOffset={12}>
            <Button size="icon" className="relative rounded-full bg-primary hover:bg-primary/90" aria-label="Open devices tab">
              <Vault size={20}/>
            </Button>
          </DisabledAction>
          <DisabledAction side="right" sideOffset={12}>
            <Button size="icon" className="relative rounded-full bg-border/80 hover:bg-border/60" aria-label="Open users tab">
              <UsersRound size={20}/>
            </Button>
          </DisabledAction>
        </div>
        <div className="flex flex-col gap-2">
          <DisabledAction side="right" sideOffset={12}>
            <Button size="icon" variant="outline" className="relative rounded-full hover:bg-muted size-9 p-0" aria-label="Open documentation">
              <FaQuestion />
            </Button>
          </DisabledAction>
          <Notifications data={notifications} />
          <DisabledAction side="right" sideOffset={12}>
            <Avatar className="xs:size-9 hover:cursor-pointer">
              <AvatarImage src="/avatar.png" alt="user avatar" className="xs:size-9" />
            </Avatar>
          </DisabledAction>
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
          </div>
          <div className="flex items-start my-[4rem] gap-2">
            <Text variant="h1">Devices</Text>
            <Statistics />
          </div>
          <div className="h-11 mb-8 flex border-b border-border" />
          <div className="h-[30vh] flex flex-col justify-center items-center gap-4 border border-border shadow-black shadow-2xl rounded-lg bg-background">
            <Text variant="p-small-thin" className="max-w-[40ch] text-center text-muted-foreground">
              No devices have been added yet.
            </Text>
            <DisabledAction side="bottom" sideOffset={12}>
              <Button variant="outline" size="sm" aria-label="Open add device form">
                <Plus className="size-4 -ml-2 mr-2" />
                Add device
              </Button>
            </DisabledAction>
          </div>
        </div>
      </div>
    </>
  )
}
