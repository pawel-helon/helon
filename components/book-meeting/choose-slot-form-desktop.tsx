"use client"

import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RiLoaderFill } from "react-icons/ri";
import { getAvailableSlotsForDate, checkSlotAvailability, blockSlot } from "@/actions/database-actions";
import { ProgressBar } from "@/components/progress-bar";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent as DialogContentWithAnimation, DialogContentWithoutAnimation, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { Text } from "@/components/typography";
import { RadioGroup, RadioGroupSlotItem as RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Slot } from "@prisma/client";

function getSlotTime(date: Date) {
  const time = String(new Date(date).getHours()).padStart(2, "0") + ":" + String(new Date(date).getMinutes()).padStart(2, "0");
  return time;
}
function getSlotDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export const ChooseSlotFormDesktop = React.memo(function ChooseSlotFormDesktop(props: {
  isChangingSlot: boolean;
}) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [displayedFirstSlot, setDisplayedFirstSlot] = useState<number>(0); 
  const [displayedLastSlot, setDisplayedLastSlot] = useState<number>(5); 
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const DialogContent = props.isChangingSlot ? DialogContentWithoutAnimation : DialogContentWithAnimation;
  
  useEffect(() => {
    if (!date) return;
    try {
      setIsLoading(true);
      setSelectedSlot("");
      setDisplayedFirstSlot(0);
      setDisplayedLastSlot(5);
      const initSlots = async () => {
        const gettingAvailableSlotsForDate = await getAvailableSlotsForDate(getSlotDate(date));
        if (gettingAvailableSlotsForDate.status !== 200) {
          toast.error(gettingAvailableSlotsForDate.message);
          return;
        }
        setIsLoading(false);
        setSlots(gettingAvailableSlotsForDate.slots);
      }
      initSlots();
      } catch (error) {
        console.error(error);
        toast.error("Error initializing slots.");
      }
  },[date])

  function handlePrevSlots() {
    setSelectedSlot("");
    setDisplayedFirstSlot(displayedFirstSlot - 5);
    setDisplayedLastSlot(displayedLastSlot - 5);
  }

  function handleNextSlots() {
    setSelectedSlot("");
    setDisplayedFirstSlot(displayedFirstSlot + 5);
    setDisplayedLastSlot(displayedLastSlot + 5);
  }

  async function handleOnSubmit(formData: FormData) {
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
    <Dialog open={true} onOpenChange={() => router.push("/home")} >
      <DialogContent id="choose-slot-form" className="h-[560px] max-w-[580px] flex flex-col flex-start bg-background-h" aria-describedby="">
        <ProgressBar />
        <DialogTitle>Book meeting</DialogTitle>
          <form action={handleOnSubmit} className="flex gap-4 mt-8">
            <Calendar initialFocus selected={date} onSelect={setDate} mode="single" />
            <div className="w-full flex flex-col gap-2">
              {isLoading ? (
                <div className="w-full flex py-2 justify-center items-center border border-input bg-background shadow-sm">
                  <RiLoaderFill className="size-5 text-muted-foreground animate-spin"/>
                </div>
              ) : (
                <>
                  {slots.length > 0 ? (
                    <>
                      {slots.filter((s, i) => displayedFirstSlot <= i && i < displayedLastSlot).map((s) => (
                        <RadioGroup key={s.id} name="slotId">
                          <RadioGroupItem key={s.id} value={s.id} onClick={() => setSelectedSlot(s.id)} className="w-full" asChild>
                            <Button variant={selectedSlot === s.id ? "secondary" : "outline"} size="sm" className={selectedSlot === s.id ? "w-full bg-accent" : "w-full"}>
                              {getSlotTime(s.dateTime)}
                            </Button>
                          </RadioGroupItem>
                        </RadioGroup>
                      ))}
                      {slots.length > 5 && (
                        <div className="w-full flex justify-end gap-2">
                          <Button disabled={displayedFirstSlot === 0} onClick={handlePrevSlots} type="button" variant="outline" className="w-full text-xs pr-6">
                            <ChevronLeft className="size-4 mr-2"/>
                            Previous
                          </Button>
                          <Button disabled={displayedLastSlot >= slots.length} onClick={handleNextSlots} type="button" variant="outline" className="w-full text-xs pl-6">
                            Next
                            <ChevronRight className="size-4 ml-2"/>
                          </Button>
                      </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full flex justify-center items-center">
                      <Text variant="p-small-thin" className="max-w-[32ch] text-center text-balance text-muted-foreground">
                        No slots available. Please choose different day.
                      </Text>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex flex-col xs:flex-row xs:justify-end p-6 gap-2">
              <Button onClick={() => router.push("/home")} type="button" variant="ghost">
                Close
              </Button>
              <Button type="submit" disabled={isPending || selectedSlot === ""} className="min-w-[64px]">
                {isPending ? <RiLoaderFill className="size-5 animate-spin" /> : "Next"}
              </Button>
            </div>
          </form>
      </DialogContent>
    </Dialog>
  )
});
