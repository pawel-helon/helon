import { Meeting } from "@prisma/client";

export async function sendBookingConfirmation(meeting: Meeting) {
  try {
    const response = await fetch("/api/emails/send-booking-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dateTime: meeting.dateTime,
        userName: meeting.userName,
        userEmail: meeting.userEmail,
        message: meeting.message
      })
    })
    if (!response.ok) {
      return { message: "Failed to send email", status: 500 };
    } else {
      return { message: "Email sent successfully", status: 200 };
    }
  } catch (e) {
    return { message: "Email sent successfully", status: 500 };
  }
}