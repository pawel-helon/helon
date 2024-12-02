"use client"

import { TransitionStartFunction } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { duplicateDay, undoDuplicateDay } from "@/actions/database-actions";
import { getEmptyCheckboxes, getNameOfDay, isBeforeEndOfDay } from "@/lib/helpers";
import { CheckboxDays } from "@/components/ui/checkbox";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import { Slot } from "@prisma/client";

export function DuplicateDayForm(props: {
  weekNumber: number;
  day: string;
  weekDays: string[];
  slots: Slot[];
  children: React.ReactNode;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  isSheetOpen: boolean;
  setIsSheetOpen: (isSheetOpen: boolean) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
}) {
  const router = useRouter();
  const emptyCheckboxes = getEmptyCheckboxes(props.weekDays.length);
  
  async function handleDuplicateDay(formData: FormData) {
    const days = props.weekDays.filter((_, index) => formData.get(index.toString()) !== null);
    if (days.length === 0) {
      toast.error('Please select at least one day.');
      return;
    }
    try {
      props.startTransition(async () => {
        const duplicatingDay = await duplicateDay(days, props.slots);
        if (duplicatingDay.status !== 201) {
          toast.error(duplicatingDay.message);
          return;
        }
        router.refresh();
        props.setIsSheetOpen(!props.isSheetOpen);
        props.setIsDialogOpen(!props.isDialogOpen);
        toast.success(duplicatingDay.message, {
          action: {
            label: 'Undo',
            onClick: () => {
              async function initUndoDuplicateDay() {
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
  
  return (
    <form action={handleDuplicateDay} className="grid grid-cols-3 xs:grid-cols-5 gap-4 xs:gap-2">
      {props.weekNumber === 1 && (
        <>
          {emptyCheckboxes.map((checkbox) => (
            <CheckboxDays key={checkbox} disabled={true} className="opacity-50" />
          ))}
        </>
      )}
      {props.weekDays.map((dayValue, index) => (
        <div key={dayValue} className={cn('col-span-1', (props.day === dayValue || isBeforeEndOfDay(dayValue)) ? 'opacity-50' : '')}>
          <CheckboxDays disabled={(props.day === dayValue || isBeforeEndOfDay(dayValue)) ? true : false} name={index.toString()} value={dayValue}>
            <Text variant='p-small-thin' className="absolute top-1 left-1 text-foreground">
              {getNameOfDay(dayValue)}
            </Text>
          </CheckboxDays>
        </div>
      ))}
      {props.weekNumber === 53 && (
        <>
          {emptyCheckboxes.map((checkbox) => (
            <CheckboxDays key={checkbox} disabled={true} className="opacity-50" />
          ))}
        </>
      )}
      {props.children}
    </form>
  )
}