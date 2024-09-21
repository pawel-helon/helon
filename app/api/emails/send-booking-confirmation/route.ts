import { BookingConfirmation } from '@/components/booking-confirmation';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request){
  try {
    const { dateTime, userName, userEmail, message } = await request.json();

    await resend.emails.send({
      from: 'Helon <onboarding@resend.dev>',
      to: ['pawel.helon.design@gmail.com'],
      subject: 'New booking',
      react: BookingConfirmation({ dateTime: dateTime, userName: userName, userEmail: userEmail, message: message }),
    });
    return new Response(JSON.stringify({ message: "Email sent successfully", status: 200 }));
  } catch (error) {
    return new Response(JSON.stringify({ message: "An unexpected error has occurred", status: 500 }));
  }
}