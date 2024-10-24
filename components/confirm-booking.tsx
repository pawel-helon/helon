"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { getSlot, unblockSlot } from "@/actions/database-actions";
import { ProgressBar } from "@/components/progress-bar";
import { Sheet, SheetContent, SheetTitleH as SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContentWithoutAnimation as DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { Slot, SLOTTYPE } from "@prisma/client";
import { ConfirmBookingForm } from "./book-meeting/confirm-booking-form";

export function ConfirmBooking(props: { slotId: string }) {
  const [slot, setSlot] = useState<Slot>({id: "", type: SLOTTYPE.AVAILABLE, dateTime: new Date(), recurring: false, createdAt: new Date(), updatedAt: new Date()});
  const router = useRouter();
  const isMobile = useMedia("(max-width: 480px)", false);

  useEffect(() => {
    async function fetchSlot() {
      try {
        const response = await getSlot(props.slotId)
        if (response.status !== 200) {
          toast.error(response.message);
        } else {
          setSlot(response.slot);
        }
      } catch (error) {
        toast.error("An error occurred while fetching the slot.")
      }
    }
    fetchSlot();
  }, [props.slotId]);

  async function handleOnOpenChange() {
    try {
      const unblockingSlot = await unblockSlot(props.slotId)
      if (unblockingSlot.status !== 200 ) {
        toast.error(unblockingSlot.message);
        return;
      }
      router.push("/home");
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Try again later.")
    }
  }

  return (
    <>
      {isMobile ? (
        <Sheet open={true} onOpenChange={handleOnOpenChange}>
          <SheetContent
            id="confirm-booking-form"
            className="bg-background-h"
            aria-describedby=""
          >
            <ProgressBar />
            <SheetTitle>Book meeting</SheetTitle>
            <ConfirmBookingForm slotID={slot.id} slotDateTime={slot.dateTime} />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true} onOpenChange={handleOnOpenChange}>
          <DialogContent
            id="confirm-booking-form"
            className="max-w-[580px] h-[560px] flex flex-col justify-start bg-background-h"
            aria-describedby=""
          >
            <ProgressBar />
            <DialogTitle className="mb-8">Book meeting</DialogTitle>
            <ConfirmBookingForm slotID={slot.id} slotDateTime={slot.dateTime} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

