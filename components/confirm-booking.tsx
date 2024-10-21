"use client";

import React, { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { Sheet, SheetContent, SheetTitleH as SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContentWithoutAnimation as DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { ProgressBar } from "@/components/progress-bar";
import { Slot, SLOTTYPE } from "@prisma/client";
import { bookSlot, getSlot, unblockSlot } from "@/actions/database-actions";
import { BookingFormState, BookingSchema } from "@/lib/validation-schemas";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Text } from "./typography";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { RiLoaderFill } from "react-icons/ri";
import { sendBookingConfirmation } from "@/actions/email-actions";

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

  return (
    <>
      {isMobile ? (
        <Sheet open={true} onOpenChange={() => { unblockSlot(props.slotId).then((r) => {
          if (r.status !== 201) {
            toast.error(r.message);
          } else {
            router.push("/home");
        }})}}>
          <SheetContent
            id="confirm-booking-form"
            className="bg-background-h"
            aria-describedby=""
          >
            <ProgressBar />
            <SheetTitle>Book meeting</SheetTitle>
            <ConfirmBookingForm slot={slot} />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true} onOpenChange={() => { unblockSlot(props.slotId).then((r) => {
          if (r.status !== 201) {
            toast.error(r.message);
          } else {
            router.push("/home");
        }})}}>
          <DialogContent
            id="confirm-booking-form"
            className="max-w-[580px] h-[560px] flex flex-col justify-start bg-background-h"
            aria-describedby=""
          >
            <ProgressBar />
            <DialogTitle className="mb-8">Book meeting</DialogTitle>
            <ConfirmBookingForm slot={slot} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function ConfirmBookingForm(props: { slot: Slot }) {
  const router = useRouter();
  const [state, setState] = useState<BookingFormState | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const utcDate = new Date(props.slot.dateTime);
  const dayOfTheWeek = utcDate.toLocaleDateString("en-US", { weekday: "long" });
  const month = utcDate.toLocaleDateString("en-US", { month: "long" });
  const year = utcDate.getFullYear();
  const day = String(utcDate.getDate()).padStart(2, "0");
  const time = utcDate.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false}).slice(0, 5);

  const handleSubmit = useCallback(async function handleSubmit(formData: FormData) {
    const validatedFields = BookingSchema.safeParse({
      fullName: formData.get("fullName"),
      phoneNumber: formData.get("phoneNumber"),
      email: formData.get("email"),
    });

    if (!validatedFields.success) {
      setState({ errors: validatedFields.error.flatten().fieldErrors });
      return;
    }

    const { fullName, phoneNumber, email } = validatedFields.data;
    const message = formData.get("message") as string;

    try {
      startTransition(async () => {
        const bookingSlot = await bookSlot(props.slot.id, fullName, phoneNumber, email, message);
        if (bookingSlot.status === 400) {
          toast.error(bookingSlot.message);
          return;
        } 

        await sendBookingConfirmation(bookingSlot.meeting);
        router.push("/home");
        
        toast.success(`Your meeting has been booked on ${dayOfTheWeek}, ${month} ${day}, ${year} at ${time}. We'll reach out to you soon.`, {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
          duration: Infinity,
        });
      });
    } catch (e) {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  },[day, dayOfTheWeek, month, props.slot.id, router, time, year])

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="w-full flex justify-between items-start p-4 gap-4 mb-6 border border-border rounded-sm">
        <Text variant="p-small-thin" className="text-white">
          {`You have selected meeting on ${dayOfTheWeek}, ${month} ${day}, ${year} at ${time}`}
        </Text>
        <Button
          type="button"
          className="focus-visible:ring-transparent"
          variant="outline"
          size="sm"
          onClick={() => {
            unblockSlot(props.slot.id).then((r) => {
              if (r.status !== 201) {
                toast.error(r.message);
              } else {
                router.push("/book-meeting");
              }
            });
          }}
        >
          Change
        </Button>
      </div>
      <div className="w-full flex gap-4">
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" placeholder="Enter your full name" />
            {state?.errors?.fullName ? (
              <Text variant="p-small-thin" className="text-right">
                {state.errors.fullName}
              </Text>
            ) : (
              <div className="h-[1rem]" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phoneNumber">Phone number</Label>
            <Input
              type="number"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your phone number"
            />
            {state?.errors?.phoneNumber ? (
              <Text variant="p-small-thin" className="text-right">
                {state.errors.phoneNumber}
              </Text>
            ) : (
              <div className="h-[1rem]" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Enter your email address"
            />
            {state?.errors?.email ? (
              <Text variant="p-small-thin" className="text-right">
                {state.errors.email}
              </Text>
            ) : (
              <div className="h-[1rem]" />
            )}
          </div>
        </div>
        <div className="w-full grow flex flex-col gap-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Briefly describe your needs."
            className="grow resize-none overflow-y-scroll scrollbar scrollbar-thumb-border scrollbar-thumb-rounded-full scrollbar-track-card-background max-h-[100vh] scrollbar-w-1 scrollbar-h-1"
          />
        </div>
        <div className="w-full absolute bottom-0 right-0 flex p-6 justify-end gap-2">
            <Button onClick={() => router.push('/home')} type="button" variant="ghost">Cancel</Button>
            <Button disabled={isPending} type="submit" className="min-w-[72px]">
              {isPending ? <RiLoaderFill className="size-5 animate-spin" /> : "Book"}
            </Button>
        </div>
      </div>
    </form>
  );
}
