"use client"

import { TransitionStartFunction } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { duplicateDay, undoDuplicateDay } from "@/actions/database-actions";
import { CheckboxDays } from "@/components/ui/checkbox";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import { Slot } from "@prisma/client";

function getEmptyCheckboxes(weekLength: number) {
  let emptyCheckboxes: number[] = [];
  let i: number = 0;
  for (i = 1; i <= 7 - weekLength; i++) {
    emptyCheckboxes.push(i);
  }
  return { emptyCheckboxes }
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
  const { emptyCheckboxes } = getEmptyCheckboxes(props.weekDays.length);
  
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
        <div key={dayValue} className={cn('col-span-1', (props.day === dayValue || new Date() > new Date(dayValue)) ? 'opacity-50' : '')}>
          <CheckboxDays disabled={(props.day === dayValue || new Date() > new Date(dayValue)) ? true : false} name={index.toString()} value={dayValue}>
            <Text variant='p-small-thin' className="absolute top-1 left-1 text-foreground">
              {DAYS_OF_WEEK[new Date(dayValue).getDay()]}
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