"use client";

import { Dispatch, SetStateAction } from "react";
import { Text } from "@/components/typography";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Notification, NOTIFICATIONTYPE } from "@prisma/client";
import { SplitButton } from "@/components/split-button";
import { useMedia } from "react-use";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function getNotificationTitle(notificationType: NOTIFICATIONTYPE | null) {
  let title: string = "";
  if (notificationType === NOTIFICATIONTYPE.ROLECHANGEREQUEST) {
    title = "Role change request";
  } else if (notificationType === NOTIFICATIONTYPE.ACCESSREQUEST) {
    title = "Access request";
  } else {
    title = "Ownership request";
  }
  return title
}

function getNotificationDateAndTime(date: Date) {
  return new Date(date).toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric"});
}

export function Items(props: { notifications: Notification[], setNotifications: Dispatch<SetStateAction<Notification[]>> }) {
  const isMobile = useMedia("(max-width: 480px)", false);

  function removeAllNotifications() {
    props.setNotifications([]);
  }
  
  function removeNotification (id: number) {
    props.setNotifications(props.notifications.filter((notification) => notification.id !== id ));
  }
  
  return (
    <div className="flex flex-col gap-4 rounded-sm pl-4 pr-2 xs:w-[427px] pb-8 pt-4 scrollbar max-h-[64vh] overflow-y-scroll scrollbar-w-1 scrollbar-track-card-background scrollbar-thumb-rounded-full scrollbar-thumb-muted">
      <div className="flex justify-end">
        <Button onClick={removeAllNotifications} size="sm" variant="outline">
          Dismiss all
        </Button>
      </div>
      <div className="space-y-8 xs:space-y-4">
        {props.notifications.map((n) => (
          <div key={n.id} className="flex flex-col gap-4 rounded-sm text-xs text-muted-foreground">
              <div className="w-full flex justify-between items-center">
                <Text variant="p-base-thin" className="text-foreground-h">
                  {getNotificationTitle(n.type)}
                </Text>
                <Text variant="p-small-thin" className="text-right text-foreground">
                  {getNotificationDateAndTime(n.createdAt)}
                </Text>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={n.requesterAvatar} alt="user avatar" className="size-8"/>
                  </Avatar>
                  <div className="flex flex-col mb-4">
                    <Text variant="p-small-thin" className="w-full text-foreground">
                      {n.requsterName}
                    </Text>
                    <Text variant="p-small-thin" className="w-full text-muted-foreground">
                      {n.title}
                    </Text>
                  </div>
                </div>
                {isMobile ? (
                  <form action={() => removeNotification(n.id)} className="w-full flex gap-2">
                    <Select name="prefix" defaultValue="Accept">
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background-sh">
                        <SelectGroup>
                          <SelectItem value="Accept" className="text-xs">Accept</SelectItem>
                          <SelectItem value="Decline" className="text-xs">Decline</SelectItem>
                          <SelectItem value="Dismiss" className="text-xs">Dismiss</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button type="submit" size="sm" className="h-9">Submit</Button>
                  </form>
                ) : (
                  <div className="flex flex-row justify-end gap-2">
                    <Button
                      onClick={() => removeNotification(n.id)}
                      size="sm"
                      variant={isMobile ? "outline" : "ghost"}
                      className="text-foreground-h"
                      >
                      Dismiss
                    </Button>
                    <SplitButton
                      primaryActionLabel="Accept"
                      primaryAction={() => removeNotification(n.id)}
                      secondaryActionLabel="Decline"
                      secondaryAction={() => removeNotification(n.id)}
                    />
                  </div>
                )}
              </div>
            </div>
        )).reverse()}
      </div>
  </div>
  )
}
