"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { deleteSlot, undoDeleteSlot, setRecurringSlot, disableRecurringSlot } from "@/actions/database-actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"
import { Slot } from "@prisma/client";

export function TimeSlotActions(props: { slot: Slot, daysExceptToday: string[] }) {
  const router = useRouter();
  const [isActionsOnSlotDropdownOpened, setIsActionsOnSlotDropdownOpened] = useState<boolean>(false);
  
  async function handleDeleteSlot() {
   try {
     const deletingSlot = await deleteSlot(props.slot.id);
     if (deletingSlot.status !== 202) {
       toast.error(deletingSlot.message);
       return;
     }
     router.refresh();
     toast.success(deletingSlot.message, {
       action: {
         label: 'Undo',
         onClick: () => {
           async function initUndoDeleteSlot() {
             const undoDeletingSlot = await undoDeleteSlot(props.slot.dateTime.toISOString());
             if (undoDeletingSlot.status !== 201) {
               toast.error(undoDeletingSlot.message);
               return;
             }
             router.refresh();
           }
           initUndoDeleteSlot();
         }
       },
       duration: 3000
     });
   } catch (error) {
     console.error(error);
     toast.error('An unexpected error occurred. Please try again later.');
   }
  }

  async function handleSetRecurringSlot() {
    try {
      const settingSlotRecurring = await setRecurringSlot(props.slot.id, props.slot.dateTime.toISOString());
      if (settingSlotRecurring.status !== 201 ) {
        toast.error(settingSlotRecurring.message);
        return;
      }
      router.refresh();
      toast.success(settingSlotRecurring.message, {
        action: {
          label: 'Undo',
          onClick: () => {
            async function initUndoSetRecurringSlot() {
              const undoSettingSlotRecurring = await disableRecurringSlot(props.slot.id, props.slot.dateTime.toISOString());
              if (undoSettingSlotRecurring.status !== 204) {
                toast.error(undoSettingSlotRecurring.message);
                return;
              }
              router.refresh();
            }
            initUndoSetRecurringSlot();
        }},
        duration: 3000
      });
      setIsActionsOnSlotDropdownOpened(!isActionsOnSlotDropdownOpened);
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }

  async function handleDisableRecurringSlot() {
    try {
      const settingSlotRecurring = await disableRecurringSlot(props.slot.id, props.slot.dateTime.toISOString())
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
              const undoDisableSlotRecurring = await setRecurringSlot(props.slot.id, props.slot.dateTime.toISOString());
              if (undoDisableSlotRecurring.status !== 201) {
                toast.error(undoDisableSlotRecurring.message);
                return;
              }
              router.refresh();
            }
            initUndoDisableRecurringSlot();
        }},
        duration: Infinity
      });
      setIsActionsOnSlotDropdownOpened(!isActionsOnSlotDropdownOpened);
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }
  
  return (
    <div className="w-full flex justify-end gap-1">
      <Button onClick={handleDeleteSlot} size="icon" variant="outline" className="size-8 bg-background-sh">
        <Trash2 size={16} />
      </Button>
      <DropdownMenu open={isActionsOnSlotDropdownOpened} onOpenChange={setIsActionsOnSlotDropdownOpened}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" className="size-8 bg-background-sh">
            <EllipsisVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="flex flex-col shadow-black shadow-sm p-1  bg-background-sh">
          <Button onClick={props.slot.recurring ? handleDisableRecurringSlot : handleSetRecurringSlot} variant='ghost' size='sm' className='justify-start text-left pl-2.5 bg-background-sh'>
            {props.slot.recurring ? "Disable recurring" : "Set recurring"}
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}