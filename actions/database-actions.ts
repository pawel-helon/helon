import { Meeting, Slot } from "@prisma/client";

// book-meeting endpoint
export async function unblockSlots(): Promise<{ message: string, status: number }> {
  const request = await fetch("/api/database/unblock-slots", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function deletePastSlots(): Promise<{ message: string, status: number }> {
  const request = await fetch("/api/database/delete-past-slots", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function getAvailableSlotsForDate(date: string): Promise<{ message: string, slots: Slot[], status: number }> {
  const request = await fetch(`/api/database/get-available-slots-for-date?date=${date}`, {
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
  const request = await fetch(`/api/database/block-slot`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: slotId
    })
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
  const request = await fetch(`/api/database/unblock-slot`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: slotId
    })
  })
  const response = await request.json();
  return response;
}

export async function bookSlot(slotId: string, fullName: string, email: string, message: string | null): Promise<{ message: string, meeting: Meeting, status: number }> {
  const request = await fetch(`/api/database/book-slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: slotId,
      fullName: fullName,
      email: email,
      message: message
    })
  })
  const response = await request.json();
  return response;
}

// scheduling endpoint - slots

export async function addSlot(day: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/add-slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      day: day
    })
  })
  const response = await request.json();
  return response;
}

export async function addRecurringSlot() {
  const request = await fetch(`/api/database/scheduling/add-recurring-slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}


// scheduling endpoint - days


