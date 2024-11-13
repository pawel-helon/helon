"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";
import { GoBellFill } from "react-icons/go";
import { Items } from "./items";
import { Text } from "@/components/typography";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Notification } from "@prisma/client";
import { useMedia } from "react-use";
import { Sheet, SheetTrigger, SheetContent, SheetTitleH as SheetTitle} from "@/components/ui/sheet";

export function Notifications(props: {
  data: Notification[],
  openDropdown?: boolean,
  setOpenDropdown?: (openDropdown: boolean) => void
}) {
  const isMobile = useMedia("(max-width: 480px)", false);
  const [notifications, setNotifications] = useState<Notification[]>(props.data)
  const [open, setOpen] = useState(false);

  return (
    <>
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <button className="w-full relative flex justify-between items-center rounded-sm px-2 py-1.5 text-sm cursor-pointer">
              Notifiactions
              <Bell size={20} />
              {notifications.length > 0 && (
                <>
                  <span className="absolute top-[3px] right-[5px] size-2 rounded-full bg-primary" />
                  <span className="absolute top-[3px] right-[5px] animate-ping size-2 rounded-full bg-primary" />
                </>
              )}
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="p-0 bg-background-sh" aria-describedby="">
            <SheetTitle className="text-center mt-8 mb-2">
              Notifications
            </SheetTitle>
            {notifications.length > 0 ? (
              <Items notifications={notifications} setNotifications={setNotifications} />
            ) : (
              <div className="flex flex-col m-6 gap-4 justify-center items-center xs:w-[429px] h-[320px] xs:h-[120px] border border-border border-dashed rounded-sm">
                <Text variant="p-small-thin" className="text-foreground-h">
                  You don&apos;t have any notifications.
                </Text>
                <Button onClick={() => props.setOpenDropdown!(!props.openDropdown)} variant="outline" size="sm">Close</Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button size="icon" variant="outline" className="relative rounded-full hover:bg-muted min-w-9 size-9 p-0" aria-label="Open notifications">
              <GoBellFill size={18}/>
              {props.data.length > 0 && (
                <>
                  <span className="absolute top-[1px] right-[1px] size-2 rounded-full bg-primary" />
                  <span className="absolute top-[1px] right-[1px] animate-ping size-2 rounded-full bg-primary" />
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            sideOffset={12}
            align="end"
            className="z-50 p-0 w-[429px] bg-background-sh border border-border shadow-black shadow-lg"
          >
            <div className="flex justify-between border-b p-4">
              <Text variant="h4">Notifications</Text>
              <div className="flex gap-1 -mr-1 -mt-1">
                <button onClick={() => setOpen(false)} >
                  <X size={16} />
                </button>
              </div>
            </div>
            {notifications.length > 0 ? (
              <Items notifications={notifications} setNotifications={setNotifications} />
            ) : (
              <div className="flex flex-col justify-center items-center w-[429px] h-[120px]">
                <Text variant="p-small-thin" className="text-foreground">
                  You don&apos;t have any notifications.
                </Text>
              </div>
            )}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
