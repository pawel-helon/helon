'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RiLoaderFill } from "react-icons/ri";
import { toast } from "sonner";
import { duplicateDay, undoDuplicateDay } from "@/actions/server-actions";
import { Dialog, DialogClose, DialogContent, DialogTitleH as DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography";
import { CheckboxDays } from "@/components/ui/checkbox";
import { Slot } from "@prisma/client";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function DuplicateDay(props: {
  day: string;
  slots: Slot[];
  weekDays: string[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  async function handleDuplicateDay(formData: FormData) {
    const days = props.weekDays.filter((_, index) => formData.get(index.toString()) !== null)
    if (days.length === 0) {
      toast.error('Please select at least one day.')
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
        setOpen(!open);
        toast.success(duplicatingDay.message, {
          action: {
            label: 'Undo',
            onClick: () => {
              async function initUndoDuplicateDay() {
                const undoDuplicatingDay = await undoDuplicateDay(duplicatingDay.prevDays!)
                if (undoDuplicatingDay.status !== 201) {
                  toast.error('Failed to undo duplicate day.');
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
    } catch {
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              <div key={dayValue} className={cn('col-span-1', props.day === dayValue ? 'opacity-50' : '')}>
              <CheckboxDays disabled={props.day === dayValue ? true : false} name={index.toString()} value={dayValue}>
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
  )
}