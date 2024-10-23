"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMedia } from "react-use";
import { ChevronDown, Plus } from "lucide-react";
import { addRecurringSlot, addSlot, deleteSlots, disableRecurringDay, setRecurringDay, undoDeleteSlots } from "@/actions/database-actions";
import { DuplicateDay } from "@/components/scheduling/availability/duplicate-day";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Slot } from "@prisma/client";
import { cn } from "@/lib/utils";

export function DayCardActions(props: {
  day: string;
  weekNumber: number;
  slots: Slot[];
  weekDays: string[];
  isRecurringDay: boolean;
  isRecurringSlotsOnly: boolean;
}) {
  const isMobile = useMedia("(max-width: 480px)", false);
  const router = useRouter();
  const [isDropdownOpened, setIsDropdownOpened] = useState<boolean>(false);

  async function handleAddSlot() {
    try {
      const addingSlot = await addSlot(props.day);
      if (addingSlot.status !== 201) {
        toast.error(addingSlot.message);
        return;
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }
  
  async function handleAddRecurringSlot() {
    try {
      const addingRecurringSlot = await addRecurringSlot(props.day);
      if (addingRecurringSlot.status !== 201) {
        toast.error(addingRecurringSlot.message);
        return;
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }

  async function handleSetRecurringDay() {
    try {
      const settingRecurringDay = await setRecurringDay(props.day, props.slots);
      if (settingRecurringDay.status !== 201) {
        toast.error(settingRecurringDay.message);
        return;
      }
      router.refresh();
      toast.success(settingRecurringDay.message, {
        action: {
          label: 'Undo',
          onClick: () => {
            async function initUndoSetRecurringDay() {
              const undoSettingRecurringDay = await disableRecurringDay(props.day, props.slots);
              if (undoSettingRecurringDay.status !== 204) {
                toast.error(undoSettingRecurringDay.message);
                return;
              }
              router.refresh();
            }
            initUndoSetRecurringDay();
          }
        },
        duration: 3000
      });
      setIsDropdownOpened(!isDropdownOpened);
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }

  async function handleDisableRecurringDay() {
    try {
      const disablingRecurringDay = await disableRecurringDay(props.day, props.slots);
      if (disablingRecurringDay.status !== 204) {
        toast.error(disablingRecurringDay.message);
        return;
      }
      router.refresh();
      toast.success(disablingRecurringDay.message, {
        action: {
          label: 'Undo',
          onClick: () => {
            async function initUndoDisableRecurringDay() {
              const undoDisablingRecurringDay = await setRecurringDay(props.day, props.slots);
              if (undoDisablingRecurringDay.status !== 201) {
                toast.error(undoDisablingRecurringDay.message);
                return;
              }
              router.refresh();
            }
            initUndoDisableRecurringDay();
          }
        },
        duration: 3000
      });
      setIsDropdownOpened(!isDropdownOpened)
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.')
    }
  }

  async function handleDeleteSlots() {
    try {
      const deletingSlots = await deleteSlots(props.day);
      if (deletingSlots.status !== 204) {
        setIsDropdownOpened(!isDropdownOpened)
        toast.error(deletingSlots.message);
        return
      }
      toast.success('Slots have been deleted', {
        action: {
          label: 'Undo',
          onClick: () => {
            async function initUndoDeleteSlots() {
              const undoingDeleteSlots = await undoDeleteSlots(deletingSlots.prevSlots!);
              if (undoingDeleteSlots.status !== 201) {
                toast.error(undoingDeleteSlots.message);
                return;
              }
              router.refresh();
            }
            initUndoDeleteSlots();
          },
        },
        duration: 3000
      });
      setIsDropdownOpened(!isDropdownOpened)
      router.refresh();
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.')
    }
  }

  const emptyCheckboxes: number[] = [];
  let i: number = 0;
  for (i = 1; i <= 7 - props.weekDays.length; i++) {
    emptyCheckboxes.push(i);
  }

  return (
    <>
      {isMobile ? (
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex">
            <DuplicateDay weekNumber={props.weekNumber} day={props.day} weekDays={props.weekDays} slots={props.slots}/>
            <DropdownMenu open={isDropdownOpened} onOpenChange={setIsDropdownOpened}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-20 rounded-l-none px-1.5 bg-background-sh">
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[132px] flex flex-col bg-background-sh shadow-black shadow-sm p-1">
                <Button onClick={props.isRecurringDay ? handleDisableRecurringDay : handleSetRecurringDay} variant="ghost" size="sm" className="justify-start text-left pl-1.5">
                  {props.isRecurringDay ? 'Disable recurring' : 'Set recurring'}
                </Button>
                <Button onClick={handleDeleteSlots} variant="ghost" size="sm" className="justify-start text-left pl-1.5">
                  Delete slots
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={props.isRecurringSlotsOnly ? handleAddRecurringSlot : handleAddSlot} className={cn('w-full', props.isRecurringSlotsOnly ? 'bg-teal-500 hover:bg-teal-500/90' : '')}>
            <Plus size={16} className="size-4 -ml-2 mr-1"/>
            {props.isRecurringSlotsOnly ? "Add recurring slot" : "Add slot"}
          </Button>
        </div>
      ) : (
        <div className="flex">
          <DuplicateDay weekNumber={props.weekNumber} day={props.day} weekDays={props.weekDays} slots={props.slots}/>
          <DropdownMenu open={isDropdownOpened} onOpenChange={setIsDropdownOpened}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-8 rounded-l-none px-1.5">
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[132px] flex flex-col bg-background-sh shadow-black shadow-sm p-1">
              <Button onClick={props.isRecurringDay ? handleDisableRecurringDay : handleSetRecurringDay} variant="ghost" size="sm" className="justify-start text-left pl-1.5">
                {props.isRecurringDay ? 'Disable recurring' : 'Set recurring'}
              </Button>
              <Button onClick={handleDeleteSlots} variant="ghost" size="sm" className="justify-start text-left pl-1.5">
                Delete slots
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  )
}
