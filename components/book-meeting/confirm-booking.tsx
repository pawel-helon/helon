"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMedia } from "react-use";
import { getSlotHelon } from "@/actions/database-actions";
import { ConfirmBookingForm } from "@/components/book-meeting/confirm-booking-form";
import { ProgressBar } from "@/components/progress-bar";
import { Sheet, SheetContentWithoutAnimation as SheetContent, SheetTitleH as SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContentWithoutAnimationAndClose as DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { Slot, SLOTTYPE } from "@prisma/client";

export function ConfirmBooking(props: { slotId: string }) {
  const [slot, setSlot] = useState<Slot>({id: "", type: SLOTTYPE.AVAILABLE, dateTime: new Date(), recurring: false, createdAt: new Date(), updatedAt: new Date()});
  const isMobile = useMedia("(max-width: 480px)", false);

  useEffect(() => {
    async function fetchSlot() {
      try {
        const response = await getSlotHelon(props.slotId)
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

  return (
    <>
      {isMobile ? (
        <Sheet open={true}>
          <SheetContent id="confirm-booking-form" className="min-w-[332px] bg-background-sh" aria-describedby="">
            <ProgressBar />
            <SheetTitle className="text-center mb-8">Book meeting</SheetTitle>
            <ConfirmBookingForm slotID={slot.id} slotDateTime={slot.dateTime} />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true}>
          <DialogContent id="confirm-booking-form" className="max-w-[580px] h-[560px] flex flex-col justify-start bg-background-sh" aria-describedby="">
            <ProgressBar />
            <DialogTitle className="mb-8">Book meeting</DialogTitle>
            <ConfirmBookingForm slotID={slot.id} slotDateTime={slot.dateTime} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

