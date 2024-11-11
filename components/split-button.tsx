"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function SplitButton(props: {
  primaryActionLabel: string;
  primaryAction: () => void;
  secondaryActionLabel: string;
  secondaryAction: () => void;
}) {
  const [openPopover, setOpenPopover] = useState<boolean>(false);

  return (
    <div className="w-full flex xs:w-[98px]">
      <Button onClick={props.primaryAction} size="sm" className="rounded-r-none border-r grow">
        {props.primaryActionLabel}
      </Button>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button size="sm" className="rounded-l-none w-12 xs:w-8 px-0">
            <ChevronDown size={16} />
          </Button> 
        </PopoverTrigger>
        <PopoverContent sideOffset={8} align="end" className="w-full xs:w-[98px] p-0">
          <Button onClick={props.secondaryAction} variant="ghost" size="sm" className="w-full justify-start">
            Decline
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
