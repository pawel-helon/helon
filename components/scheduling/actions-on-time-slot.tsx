'use client'

import { deleteSlot, setSlotRecurring } from "@/actions/server-actions";
import { Button } from "../ui/button"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { Slot } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";
import { DuplicateSlotFor } from "./duplicate-slot-for";

export function ActionsOnTimeSlot(props: { slot: Slot, daysExceptToday: string[] }) {
  const router = useRouter();

  const [actionsOnSlotDropdownOpened, setActionsOnSlotDropdownOpened] = useState<boolean>(false);
  
  async function handleSetRecurringSlot() {
    try {
      const settingSlotRecurring = await setSlotRecurring(props.slot)
      if (settingSlotRecurring.status !== 201 ) {
        toast.error(settingSlotRecurring.message)
        return;
      }
      router.refresh();
      toast.success(settingSlotRecurring.message);
      setActionsOnSlotDropdownOpened(!actionsOnSlotDropdownOpened);
    } catch {
      toast.error('An error occurred. Please try again later.');
    }
  }
  
  async function handleDeleteSlot(slotId: string) {
    try {
      const deletingSlot = await deleteSlot(slotId);
      if (deletingSlot.status !== 202) {
        toast.error('Failed to delete slot');
        return;
      }
      router.refresh();
    } catch {
      toast.error('Failed to delete slot');
    }
  }
  
  return (
    <div className="w-full flex justify-end gap-1">
      <Button onClick={() => handleDeleteSlot(props.slot.id)} size="icon" variant="outline" className="size-8">
        <Trash2 size={16} />
      </Button>
      <DropdownMenu open={actionsOnSlotDropdownOpened} onOpenChange={setActionsOnSlotDropdownOpened}>
        <DropdownMenuTrigger asChild>
          <Button onClick={() => {}} size="icon" variant="outline" className="size-8">
            <EllipsisVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="flex flex-col bg-black shadow-black shadow-md p-1">
          <DuplicateSlotFor slot={props.slot} daysExceptToday={props.daysExceptToday} actionsOnSlotDropdownOpened={actionsOnSlotDropdownOpened} setActionsOnSlotDropdownOpened={setActionsOnSlotDropdownOpened} />
          <Button onClick={handleSetRecurringSlot} variant='ghost' size='sm' className='justify-start text-left pl-2.5'>
            Set recurring
          </Button>
          <Button variant="ghost" size="sm" className="justify-start text-left pl-2.5">
            Delete slot
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}