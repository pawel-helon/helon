import { Slot } from "@prisma/client";

export async function getAvailableSlotsForDate(formattedDate: string): Promise<{ message: string, slots: Slot[], status: number }> {
  const request = await fetch(`/api/database/get-available-slots-for-date?date=${formattedDate}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function checkSlotAvailability(slotId: string): Promise<{ message: string, status: number }> {
  const request = await fetch(`/api/database/check-slot-availability?slotId=${slotId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function blockSlot(slotId: string): Promise<{ message: string, status: number }> {
  const request = await fetch(`/api/database/block-slot?slotId=${slotId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function getSlot(slotId: string): Promise<{ message: string, slot: Slot, status: number }> {
  const request = await fetch(`/api/database/get-slot?slotId=${slotId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function unblockSlot(slotId: string): Promise<{ message: string, status: number }> {
  const request = await fetch(`/api/database/unblock-slot?slotId=${slotId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function bookSlot(slotId: string, fullName: string, email: string, message: string | null): Promise<{ message: string, status: number }> {
  const request = await fetch(`/api/database/book-slot?slotId=${slotId}&fullName=${fullName}&email=${email}&message=${message}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function createSlot(date: Date): Promise<{ message: string, slot: Slot, status: number }> {
  const formattedDate = date.toISOString();
  
  const request = await fetch(`/api/database/create-slot?date=${formattedDate}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}
