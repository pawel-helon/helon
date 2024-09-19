import { z } from "zod";

export const BookingSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .trim(),
  email:
  z.string().email({ message: "Please enter a valid email" }).trim(),
})

export type BookingFormState =
  | {
    errors?: {
      fullName?: string[];
      email?: string[];
    };
    message?: string;
    }
  | undefined;
