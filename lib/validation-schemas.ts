import { z } from "zod";

export const BookingSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .trim(),
  phoneNumber: z
    .string().min(9, { message: "Phone number must be 9 digits long" }).max(9),
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .trim(),
})

export type BookingFormState =
  | {
      errors?: {
        fullName?: string[];
        phoneNumber?: string[];
        email?: string[];
      };
      message?: string;
    }
  | undefined;

export const DuplicateDaySlotsSchema = z.object({
  day: z.string().min(1, { message: "Please select day" })
})

export type DuplicateDaySlotsFormState =
  | {
      errors?: {
        day?: string[];
      }
      message?: string;
    }
  | undefined;
