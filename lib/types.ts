import { Slot } from "@prisma/client";

export type WeekSlots = { day: string; slots: Slot[] }[];