"use client"

import { useState, useTransition } from "react";
import { useMedia } from "react-use"
import { RiLoaderFill } from "react-icons/ri";
import { DuplicateDayForm } from "./duplicate-day-form";
import { Dialog, DialogClose, DialogContent, DialogTitleH as DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetClose, SheetContent, SheetTitleH as SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slot } from "@prisma/client";

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
            <Button aria-label="Duplicate day" variant='outline' className='w-full rounded-r-none bg-background-sh'>
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
                  <Button aria-label="Cancel" variant="ghost">
                    Cancel
                  </Button>
                </SheetClose>
                <Button aria-label="Submit" disabled={isPending} type='submit' className="">
                  {isPending ? <RiLoaderFill className="size-5 animate-spin"/>: 'Duplicate'}
                </Button>
              </div>
          </DuplicateDayForm>
          </SheetContent>
        </Sheet>
      ) : (

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button aria-label="Duplicate day" variant='outline' size='sm' className='w-[100px] justify-start rounded-r-none text-left pl-2.5 bg-background-sh'>
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
                  <Button aria-label="Cancel" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
                <Button aria-label="Submit" disabled={isPending} type='submit' className="min-w-[108px]">
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
