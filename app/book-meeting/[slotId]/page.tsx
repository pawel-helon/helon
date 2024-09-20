"use client"

import { ConfirmBooking } from "@/components/confirm-booking";
export default function ConfirmBookingPage(props: { params: { slotId: string }}) {
  return <ConfirmBooking slotId={props.params.slotId} />;
}
