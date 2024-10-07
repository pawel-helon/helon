'use client'

import { deleteSlot, disableRecurringSlot, setRecurringSlot, undoDeleteSlot } from "@/actions/server-actions";
import { Button } from "../ui/button"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { Slot } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";

export function ActionsOnTimeSlot(props: { slot: Slot, daysExceptToday: string[] }) {
  const router = useRouter();
  const [actionsOnSlotDropdownOpened, setActionsOnSlotDropdownOpened] = useState<boolean>(false);
  
  async function handleSetRecurringSlot() {
    try {
      const settingSlotRecurring = await setRecurringSlot(props.slot)
      if (settingSlotRecurring.status !== 201 ) {
        toast.error(settingSlotRecurring.message)
        return;
      }
      router.refresh();
      toast.success(settingSlotRecurring.message, {
        action: {
          label: 'Undo',
          onClick: () => {
            async function initUndoSetRecurringSlot() {
              const undoSettingSlotRecurring = await disableRecurringSlot(props.slot);
              if (undoSettingSlotRecurring.status !== 204) {
                toast.error('Failed to undo set recurring slot.');
                return;
              }
              router.refresh();
            }
            initUndoSetRecurringSlot();
        }}
      });
      setActionsOnSlotDropdownOpened(!actionsOnSlotDropdownOpened);
    } catch {
      toast.error('An error occurred. Please try again later.');
    }
  }

  async function handleDisableRecurringSlot() {
    try {
      const settingSlotRecurring = await disableRecurringSlot(props.slot)
      if (settingSlotRecurring.status !== 204 ) {
        toast.error(settingSlotRecurring.message)
        return;
      }
      router.refresh();
      toast.success(settingSlotRecurring.message, {
        action: {
          label: 'Undo',
          onClick: () => {
            async function initUndoDisableRecurringSlot() {
              const undoDisableSlotRecurring = await setRecurringSlot(props.slot);
              if (undoDisableSlotRecurring.status !== 201) {
                toast.error('Failed to undo disable recurring slot.');
                return;
              }
              router.refresh();
            }
            initUndoDisableRecurringSlot();
        }}
      });
      setActionsOnSlotDropdownOpened(!actionsOnSlotDropdownOpened);
    } catch {
      toast.error('An error occurred. Please try again later.');
    }
  }
  
  async function handleDeleteSlot(slotId: string) {
    try {
      const deletingSlot = await deleteSlot(slotId);
      if (deletingSlot.status !== 202) {
        toast.error('Failed to delete slot.');
        return;
      }
      router.refresh();
      toast.success('Slot deleted successfully.', {
        action: {
          label: 'Undo',
          onClick: () => {
            async function initUndoDeleteSlot() {
              const undoDeletingSlot = await undoDeleteSlot(props.slot);
              if (undoDeletingSlot.status !== 201) {
                toast.error('Failed to undo delete slot.');
                return;
              }
              router.refresh();
            }
            initUndoDeleteSlot();
          }
        },
        duration: 3000
      });
    } catch {
      toast.error('Failed to delete slot.');
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
          <Button onClick={props.slot.recurring ? handleDisableRecurringSlot : handleSetRecurringSlot} variant='ghost' size='sm' className='justify-start text-left pl-2.5'>
            {props.slot.recurring ? "Disable recurring" : "Set recurring"}
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}