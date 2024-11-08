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

export const DeviceNameSchema = z.object({
  deviceName: z
    .string()
    .min(2, { message: "Device name must be at least 2 characters long" })
    .trim(),
});

export type DeviceNameFormState =
  | {
      errors?: {
        deviceName?: string[];
      };
      message?: string;
    }
  | undefined;

export const OwnerSchema = z.object({
  owner: z.string().min(1, { message: "Select owner" }),
});

export type OwnerFormState =
  | {
      errors?: {
        owner?: string[];
      };
      message?: string;
    }
  | undefined;
  
export const EMEISchema = z.object({
  emei: z.string()
    .min(15, { message: "EMEI number must be 15 digits long" })
    .max(15),
});

export type EMEIFormState =
  | {
      errors?: {
        emei?: string[];
      };
      message?: string;
    }
  | undefined;

export const ModelSchema = z.object({
  model: z.string().min(1, { message: "Select model" }),
});

export type ModelFormState =
  | {
      errors?: {
        model?: string[];
      };
      message?: string;
    }
  | undefined;


export const PhoneNumberSchema = z.object({
  SIM: z.string().min(1, { message: "Enter SIM card number" }).trim(),
});

export type PhoneNumberFormState =
  | {
      errors?: {
        SIM?: string[];
      };
      message?: string;
    }
  | undefined;