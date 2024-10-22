"use client"

import { TransitionStartFunction, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMedia } from "react-use"
import { RiLoaderFill } from "react-icons/ri";
import { duplicateDay, undoDuplicateDay } from "@/actions/database-actions";
import { CheckboxDays } from "@/components/ui/checkbox";
import { Text } from "@/components/typography";
import { Dialog, DialogClose, DialogContent, DialogTitleH as DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetClose, SheetContent, SheetTitleH as SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slot } from "@prisma/client";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function DuplicateDayForm(props: {
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
  
  async function handleDuplicateDay(formData: FormData) {
    const days = props.weekDays.filter((_, index) => formData.get(index.toString()) !== null)
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

  const emptyCheckboxes: number[] = [];
  let i: number = 0;
  for (i = 1; i <= 7 - props.weekDays.length; i++) {
    emptyCheckboxes.push(i);
  }
  
  return (
    <form action={handleDuplicateDay} className="grid grid-cols-3 xs:grid-cols-5 gap-4 xs:gap-2">
      {props.weekNumber === 1 && (
        <>
          {emptyCheckboxes.map((checkbox) => {
            return (
              <CheckboxDays key={checkbox} disabled={true} className="opacity-50" />
            )
          })}
        </>
      )}
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
      {props.weekNumber === 53 && (
        <>
          {emptyCheckboxes.map((checkbox) => {
            return (
              <CheckboxDays key={checkbox} disabled={true} className="opacity-50" />
            )
          })}
        </>
      )}
      {props.children}
    </form>
  )
}

export function DuplicateDay(props: {
  weekNumber: number;
  day: string;
  weekDays: string[];
  slots: Slot[]
}) {
  const isMobile = useMedia("(max-width: 480px)", false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  
  return (
    <>
      {isMobile ? (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant='outline' className='w-full rounded-r-none bg-background-sh'>
              Duplicate
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" aria-describedby="" className="min-h-[520px] bg-background-sh">
            <SheetTitle className='mb-8 text-center'>Duplicate</SheetTitle>
            <DuplicateDayForm
              weekNumber={props.weekNumber}
              day={props.day}
              weekDays={props.weekDays}
              slots={props.slots}
              isPending={isPending}
              startTransition={startTransition}
              isSheetOpen={isSheetOpen}
              setIsSheetOpen={setIsSheetOpen}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
            >
              <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
                <SheetClose asChild>
                  <Button variant="ghost">
                    Cancel
                  </Button>
                </SheetClose>
                <Button disabled={isPending} type='submit' className="">
                  {isPending ? <RiLoaderFill className="size-5 animate-spin"/>: 'Duplicate'}
                </Button>
              </div>
          </DuplicateDayForm>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' size='sm' className='w-[100px] justify-start rounded-r-none text-left pl-2.5 bg-background-sh'>
            Duplicate
          </Button>
        </DialogTrigger>
        <DialogContent aria-describedby='' className='min-h-[400px] min-w-[480px] flex flex-col flex-start bg-background-sh'>
          <DialogTitle className='mb-8'>Duplicate</DialogTitle>
          <DuplicateDayForm
            weekNumber={props.weekNumber}
            day={props.day}
            weekDays={props.weekDays}
            slots={props.slots}
            isPending={isPending}
            startTransition={startTransition}
            isSheetOpen={isSheetOpen}
            setIsSheetOpen={setIsSheetOpen}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          >
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
          </DuplicateDayForm>
        </DialogContent>
      </Dialog>
      )}
    </>
  )
}
