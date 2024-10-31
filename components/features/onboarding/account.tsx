"use client"

import { BookOpenText, CircleUserRound, LogOut } from "lucide-react";
import { useMedia } from "react-use";
import { Text } from "@/components/typography";
import { OnboardingAccount } from "@/components/features/onboarding/onboarding-account";
import { OnboardingDocs } from "@/components/features/onboarding/onboarding-docs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Account(props: {
  showAccount: boolean;
  showDocs?: boolean;
  onboardingID: string;
}) {
  const isMobile = useMedia("(max-width: 480px)", false);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={props.showAccount}>
        <div className="relative">
          <Avatar className="xs:size-9 hover:cursor-pointer">
            <AvatarImage src="/avatar.png" alt="user avatar" className="xs:size-9" />
          </Avatar>
          {(props.showAccount || props.showDocs) && (
            <div className="absolute -bottom-[8px] xs:bottom-[20px] -right-[8px] flex p-1 bg-secondary rounded-full shadow-sm shadow-black">
              <BookOpenText size={16} />
            </div>
          )}
          {props.showAccount && <OnboardingAccount onboardingID={props.onboardingID}/>}
          {props.showDocs && <OnboardingDocs onboardingID={props.onboardingID}/>}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isMobile ? "bottom" : "right"}
        align="start"
        className={cn(
          "bg-background shadow-black shadow-md absolute",
          isMobile ? "-right-[40px] top-[4px]" : "left-[8px] -bottom-[18px]",
        )}
      >
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Avatar className="size-6">
            <AvatarImage src="/avatar.png" alt="user" className="size-6" />
          </Avatar>
          <Text variant="p-base-thin">alex.atkins@q.com</Text>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="realtive flex justify-between cursor-pointer">
          Account
          <CircleUserRound size={20} />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between items-center w-full">
          Sign out
          <LogOut size={20} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}