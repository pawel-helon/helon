import { ConfirmBooking } from "@/components/confirm-booking";
export default async function ConfirmBookingPage(props: { params: { slotId: string }}) {
  return <ConfirmBooking slotId={props.params.slotId} />;
}
