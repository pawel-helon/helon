"use client";

import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { RiLoaderFill } from "react-icons/ri";
import { getAvailableSlotsForDate, checkSlotAvailability, blockSlot, unblockSlots, deletePastSlots, createSampleSlots } from "@/actions/database-actions";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetTitleH as SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupSlotItem as RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/progress-bar";
import { Slot } from "@prisma/client";
import { Text } from "@/components/typography";

export default function ChooseSlotPage() {
  const router = useRouter();
  const isMobile = useMedia("(max-width: 480px)", false);

  useEffect(() => {
    deletePastSlots();
    unblockSlots();
    createSampleSlots();
  })
  
  return (
    <>
      {isMobile ? (
        <Sheet open={true} onOpenChange={() => router.push("/home")}>
          <SheetContent id="choose-slot-form" className="bg-background-h" aria-describedby="">
            <ProgressBar />
            <SheetTitle>Book meeting</SheetTitle>
            <ChooseSlotForm />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true} onOpenChange={() => router.push("/home")} >
          <DialogContent id="choose-slot-form" className="max-w-[580px] h-[480px] flex flex-col flex-start bg-background-h" aria-describedby="">
            <ProgressBar />
            <DialogTitle>Book meeting</DialogTitle>
            <ChooseSlotForm />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function ChooseSlotForm() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  
  useEffect(() => {
    setSelectedSlot("");
    const formattedDate = `${date!.getFullYear()}-${String(date!.getMonth() + 1).padStart(2, '0')}-${String(date!.getDate()).padStart(2, '0')}`;
    if (date) {
      getAvailableSlotsForDate(formattedDate).then((r) => {
        if (r.status !== 200) {
          toast.error(r.message);
        } else {
          setSlots(r.slots);
        }
      })
    }
  },[date])

  async function handleSubmit(formData: FormData) {
    const slotId = formData.get("slotId") as string;
    if (!slotId) {
      toast.error("Please select a slot to continue.");
      return;
    }
    
    startTransition(async () => {
      try {
        const checkingSlotAvailability = await checkSlotAvailability(slotId);
        if (checkingSlotAvailability.status !== 200) {
          toast.error(checkingSlotAvailability.message);
          return;
        }
        const blockingSlot = await blockSlot(slotId);
        if (blockingSlot.status !== 201) {
          toast.error(blockingSlot.message);
          return;
        }
        
        router.push(`/book-meeting/${slotId}`);
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again later.")
      }
    } )
  }

  return (
    <form action={handleSubmit} className="flex gap-4 mt-8">
      <Calendar
        initialFocus
        selected={date}
        onSelect={setDate}
        mode="single"
      />
      <div className="w-full flex flex-col gap-2">
        <RadioGroup name="slotId">
          {slots.length > 0 ? (
            slots.map((slot) => {
              const utcDate = new Date(slot.dateTime);
              const localTime = utcDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).slice(0, 5);
              return (
                <RadioGroupItem key={slot.id} value={slot.id} onClick={() => setSelectedSlot(slot.id)} className="w-full" asChild>
                  <Button variant={selectedSlot === slot.id ? "default" : "outline"} size="sm" className="w-full">
                    {localTime}
                  </Button>
                </RadioGroupItem>
              );
            })
          ) : (
            <div className="flex items-center justify-center">
              <Text variant="p-small-thin" className="max-w-[40ch] text-center text-muted-foreground">
                No slots available. Please choose another day.
              </Text>
            </div>
          )}
        </RadioGroup>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex flex-col xs:flex-row xs:justify-end p-6 gap-2">
        <Button onClick={() => router.push("/home")} type="button" variant="ghost">
          Close
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-[64px]">
          {isPending ? <RiLoaderFill className="size-5 animate-spin" /> : "Next"}
        </Button>
      </div>
    </form>
  );
}
