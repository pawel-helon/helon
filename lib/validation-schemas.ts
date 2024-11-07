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
    .email({ message: "Enter a valid email" })
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

// forms

export const AddDeviceSchema = z.object({
  deviceName: z
    .string()
    .min(2, { message: "Device name must be at least 2 characters long" })
    .trim(),
  owner: z.string().min(1, { message: "Select owner" }),
  emei: z.string()
    .min(15, { message: "EMEI number must be 15 digits long" })
    .max(15),
  model: z.string().min(1, { message: "Select model" }),
  SIM: z.string().min(1, { message: "Enter SIM card number" }).trim(),
});

export type AddDeviceFormState =
  | {
      errors?: {
        deviceName?: string[];
        owner?: string[];
        emei?: string[];
        model?: string[];
        SIM?: string[];
      };
      message?: string;
    }
  | undefined;
