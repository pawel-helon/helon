"use client"

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMedia } from "react-use";
import { RiLoaderFill } from "react-icons/ri";
import { getAvailableSlotsForDate, checkSlotAvailability, unblockSlots, deletePastSlots, rescheduleMeeting, undoRescheduleMeeting } from "@/actions/database-actions";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetTitleH as SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitleH as DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupSlotItem as RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography";
import { Slot } from "@prisma/client";

const ChooseSlotForm = React.memo(function ChooseSlotForm(props: {
  meetingId: string;
  userName: string;
  openDropdown: boolean;
  setOpenDropdown: (openDropdown: boolean) => void;
}) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (!date) return;
    setIsLoading(true);
    setSelectedSlot("");
    
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    if (date) {
      getAvailableSlotsForDate(formattedDate).then((r) => {
        setIsLoading(false);
        if (r.status !== 200) {
          toast.error(r.message);
        } else {
          setSlots(r.slots);
        }
      }).catch(() => {
        setIsLoading(false);
        toast.error("Failed to load available slots.")
      })
    }
  },[date])

  async function handleSubmit(formData: FormData) {
    const slotId = formData.get("slotId") as string;
    if (!slotId) {
      toast.error("Please select slot");
      return;
    }
    
    startTransition(async () => {
      try {
        const checkingSlotAvailability = await checkSlotAvailability(slotId);
        if (checkingSlotAvailability.status !== 200) {
          toast.error(checkingSlotAvailability.message);
          return;
        }
        const reschedulingMeeting = await rescheduleMeeting(props.meetingId, slotId);
        if (reschedulingMeeting.status !== 200) {
          toast.error(reschedulingMeeting.message);
          return;
        }
        props.setOpenDropdown(!props.openDropdown);
        router.refresh();
        toast.success(`Meeting with ${props.userName} has been rescheduled`, {
          action: {
            label: 'Undo',
            onClick: async () => {
              const undoingRescheduleMeeting = await undoRescheduleMeeting(props.meetingId, reschedulingMeeting.prevSlotId!);
              if (undoingRescheduleMeeting.status !== 200) {
                toast.error(undoingRescheduleMeeting.message);
                return;
              }
              router.refresh();
              toast.success(`Meeting time with ${props.userName} has been restored`)
            }
          },
          duration: 3000
        })
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
        {isLoading ? (
          <div className="w-full flex py-2 justify-center items-center border border-input bg-background shadow-sm">
            <RiLoaderFill className="size-5 text-muted-foreground animate-spin"/>
          </div>
        ) : (
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
                <Text variant="p-small-thin" className="max-w-[40ch] text-center text-balance text-muted-foreground">
                  No slots available. Please choose different day.
                </Text>
              </div>
            )}
          </RadioGroup>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex flex-col xs:flex-row xs:justify-end p-6 gap-2">
        <Button onClick={() => router.push("/home")} type="button" variant="ghost">
          Close
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-[128px]">
          {isPending ? <RiLoaderFill className="size-5 animate-spin" /> : "Reschedule"}
        </Button>
      </div>
    </form>
  );
});

export function RescheduleMeeting(props: {
  meetingId: string;
  userName: string;
  openDropdown: boolean;
  setOpenDropdown: (openDropdown: boolean) => void;
}) {
  const isMobile = useMedia("(max-width: 480px)", false);

  useEffect(() => {
    async function initSlots() {
      try {
        await deletePastSlots();
        await unblockSlots();
      } catch {
        toast.error("Error initializing slots.")
      }
    }
    initSlots();
  },[])
  
  return (
    <>
      {isMobile ? (
        <Sheet onOpenChange={props.setOpenDropdown}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="justify-start text-left pl-2.5">
              Reschedule
            </Button>
          </SheetTrigger>
          <SheetContent id="choose-slot-form" className="bg-background-h" aria-describedby="">
            <SheetTitle>Reschedule meeting</SheetTitle>
            <ChooseSlotForm meetingId={props.meetingId} userName={props.userName} openDropdown={props.openDropdown} setOpenDropdown={props.setOpenDropdown}/>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog onOpenChange={props.setOpenDropdown}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="justify-start text-left pl-2.5">
              Reschedule
            </Button>
          </DialogTrigger>
          <DialogContent id="choose-slot-form" className="max-w-[580px] h-[480px] flex flex-col flex-start bg-background-h" aria-describedby="">
            <DialogTitle>Reschedule meeting</DialogTitle>
            <ChooseSlotForm meetingId={props.meetingId} userName={props.userName} openDropdown={props.openDropdown} setOpenDropdown={props.setOpenDropdown}/>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}