"use client"

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { RiLoaderFill } from "react-icons/ri";
import { deleteSlots, disableRecurringDay, duplicateDay, setRecurringDay, undoDeleteSlots, undoDuplicateDay } from "@/actions/database-actions";
import { Dialog, DialogClose, DialogContent, DialogTitleH as DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Text } from "@/components/typography";
import { CheckboxDays } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slot } from "@prisma/client";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function DayCardActions(props: {
  day: string;
  slots: Slot[];
  weekDays: string[];
  isRecurringDay: boolean;
}) {
  const router = useRouter();
  const [isDropdownOpened, setIsDropdownOpened] = useState<boolean>(false);
  const [isDuplicateDayDialogOpen, setIsDuplicateDayDialogOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  async function handleDuplicateDay(formData: FormData) {
    const days = props.weekDays.filter((_, index) => formData.get(index.toString()) !== null)
    if (days.length === 0) {
      toast.error('Please select at least one day.');
      return;
    }
    try {
      startTransition(async () => {
        const duplicatingDay = await duplicateDay(days, props.slots);
        if (duplicatingDay.status !== 201) {
          toast.error(duplicatingDay.message);
          return;
        }
        router.refresh();
        setIsDuplicateDayDialogOpen(!isDuplicateDayDialogOpen);
        toast.success(duplicatingDay.message, {
          action: {
            label: 'Undo',
            onClick: () => {
              async function initUndoDuplicateDay() {
                console.log(duplicatingDay.prevSlots);
                const undoDuplicatingDay = await undoDuplicateDay(duplicatingDay.prevSlots!);
                if (undoDuplicatingDay.status !== 201) {
                  toast.error(undoDuplicatingDay.message);
                  return;
                }
                router.refresh();
              }
              initUndoDuplicateDay();
            }
          },
          duration: 3000
        });
      })
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
  
  return (
    <div className="flex">
      <Dialog open={isDuplicateDayDialogOpen} onOpenChange={setIsDuplicateDayDialogOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' size='sm' className='w-[100px] justify-start rounded-r-none text-left pl-2.5'>
            Duplicate
          </Button>
        </DialogTrigger>
        <DialogContent aria-describedby='' className='min-h-[400px] min-w-[480px] flex flex-col flex-start bg-background-sh'>
          <DialogTitle className='mb-8'>Duplicate</DialogTitle>
          <form action={handleDuplicateDay} className="grid grid-cols-5 gap-2">
            {props.weekDays.map((dayValue, index) => {
              return (
                <div key={dayValue} className={cn('col-span-1', (props.day === dayValue || new Date() > new Date(dayValue)) ? 'opacity-50' : '')}>
                <CheckboxDays disabled={(props.day === dayValue || new Date() > new Date(dayValue)) ? true : false} name={index.toString()} value={dayValue}>
                  <Text variant='p-small-thin' className="absolute top-1 left-1 text-foreground">
                    {DAYS_OF_WEEK[new Date(dayValue).getDay()]}
                  </Text>
                </CheckboxDays>
              </div>
              )
            })}
            <div className="w-full absolute bottom-0 left-0 right-0 flex justify-end p-6 gap-2">
              <DialogClose asChild>
                <Button variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isPending} type='submit' className="min-w-[108px]">
                {isPending ? <RiLoaderFill className="size-5 animate-spin"/>: 'Duplicate'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <DropdownMenu open={isDropdownOpened} onOpenChange={setIsDropdownOpened}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-8 rounded-l-none px-1.5">
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[132px] flex flex-col bg-black shadow-black shadow-md p-1">
          <Button onClick={props.isRecurringDay ? handleDisableRecurringDay : handleSetRecurringDay} variant="ghost" size="sm" className="justify-start text-left pl-1.5">
            {props.isRecurringDay ? 'Disable recurring' : 'Set recurring'}
          </Button>
          <Button onClick={handleDeleteSlots} variant="ghost" size="sm" className="justify-start text-left pl-1.5">
            Delete slots
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
