"use client"

import React, { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RiLoaderFill } from "react-icons/ri";
import { sendBookingConfirmation } from "@/actions/email-actions";
import { bookSlot, unblockSlot } from "@/actions/database-actions";
import { BookingFormState, BookingSchema } from "@/lib/validation-schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/typography";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function getSlotDateAndTime(date: Date) {
  const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayOfWeek = DAYS_OF_WEEK[new Date(date).getDay()];
  const month = MONTHS[new Date(date).getMonth()];
  const day = String(new Date(date).getDate()).padStart(2, "0");
  const year = new Date(date).getFullYear();
  const time = String(new Date(date).getHours()).padStart(2, "0") + ":" + String(new Date(date).getMinutes()).padStart(2, "0");
  return <span>{dayOfWeek}, {month} {day}, {year} <span className="text-muted-foreground">at</span> {time}</span>;
}

export function ConfirmBookingForm(props: {
  slotID: string;
  slotDateTime: Date;
}) {
  const router = useRouter();
  const [state, setState] = useState<BookingFormState | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const utcDate = new Date(props.slotDateTime);
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
        const bookingSlot = await bookSlot(props.slotID, fullName, phoneNumber, email, message);
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
  },[day, dayOfTheWeek, month, props.slotID, router, time, year])

  async function handleCancel() {
    try {
      const unblockingSlot = await unblockSlot(props.slotID)
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

  async function handleChangeSlot() {
    try {
      const unblockingSlot = await unblockSlot(props.slotID)
      if (unblockingSlot.status !== 200 ) {
        toast.error(unblockingSlot.message);
        return;
      }
      router.back();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Try again later.")
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="w-full flex justify-between items-center p-4 gap-4 mb-6 border border-border rounded-sm">
        <Text variant="p-small-thin">
          You have selected meeting on{" "}<span className="text-foreground-h">{getSlotDateAndTime(props.slotDateTime)}</span>
        </Text>
        <Button onClick={handleChangeSlot} type="button" className="focus-visible:ring-transparent" variant="outline" size="sm">
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
            <Button onClick={handleCancel} type="button" variant="ghost">Cancel</Button>
            <Button disabled={isPending} type="submit" className="min-w-[72px]">
              {isPending ? <RiLoaderFill className="size-5 animate-spin" /> : "Book"}
            </Button>
        </div>
      </div>
    </form>
  );
}