import * as React from "react";
import { Body, Container, Head, Heading, Html, Preview, Text, Tailwind } from "@react-email/components";
import { inter, poppins } from "@/components/typography";
import { cn } from "@/lib/utils";

interface BookingConfirmationProps {
  dateTime: string;
  userName: string;
  userEmail: string;
  message: string;
}

export const BookingConfirmation: React.FC<
  Readonly<BookingConfirmationProps>
> = ({ dateTime, userName , userEmail, message}) => (
  <Html>
    <Head />
    <Preview>New booking</Preview>
    <Tailwind>
      <Body className={cn(poppins.className, "bg-white my-auto mx-auto font-sans px-2")}>
        <Container className="border border-solid border-[#E4E4E7] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
          <Heading className={cn(inter.className, "text-[#09090B] text-xl leading-tight font-semibold p-0 mt-[20px] mb-[30px] mx-0")}>
            New booking
          </Heading>
          <Text className="text-[#09090B] text-sm leading-snug font-normal">
            {`${userName}(${userEmail}) booked meeting at ${dateTime} with the following message: ${message}`}
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
