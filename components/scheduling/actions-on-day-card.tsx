import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Slot } from "@prisma/client";
import { DuplicateDaySlotsFor } from "./duplicate-day-slots-for";
import { useState } from "react";
import { DeleteDaySlots } from "./delete-day-slots";

export function ActionsOnDayCard(props: {
  day: string;
  slots: Slot[];
  daysExceptToday: string[];
}) {
  const [dropdownOpened, setDropdownOpened] = useState<boolean>(false);
  
  return (
    <div className="flex">
      <DuplicateDaySlotsFor day={props.day} slots={props.slots} daysExceptToday={props.daysExceptToday}/>
      <DropdownMenu open={dropdownOpened} onOpenChange={setDropdownOpened}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-8 rounded-l-none px-1.5">
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[132px] flex flex-col bg-black shadow-black shadow-md p-1">
          <SetRecurring />
          <DeleteDaySlots day={props.day} dropdownOpened={dropdownOpened} setDropdownOpened={setDropdownOpened}/>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function SetRecurring() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="justify-start text-left pl-2.5">
          Set recurring
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background-h">
        Are you sure...set recurring
      </DialogContent>
    </Dialog>
  )
}
