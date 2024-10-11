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

// scheduling/availability - slots

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

export async function addRecurringSlot(day: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/add-recurring-slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      day: day
    })
  })
  const response = await request.json();
  return response;
}

export async function deleteSlot(slotId: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/delete-slot`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: slotId
    })
  })
  const response = await request.json();
  return response;
}

export async function undoDeleteSlot(dateTime: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/undo-delete-slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dateTime: dateTime,
    })
  })
  const response = await request.json();
  return response;
}

export async function setRecurringSlot(slotId: string, dateTime: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/set-recurring-slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: slotId,
      dateTime: dateTime,
    })
  })
  const response = await request.json();
  return response;
}

export async function disableRecurringSlot(slotId: string, dateTime: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/disable-recurring-slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: slotId,
      dateTime: dateTime,
    })
  })
  const response = await request.json();
  return response;
}

export async function updateSlotHour(slotId: string, dateTime: string, hour: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/update-slot-hour`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: slotId,
      dateTime: dateTime,
      hour: hour
    })
  })
  const response = await request.json();
  return response;
} 

export async function updateSlotMinute(slotId: string, dateTime: string, minute: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/update-slot-minute`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: slotId,
      dateTime: dateTime,
      minute: minute
    })
  })
  const response = await request.json();
  return response;
} 
// scheduling/availability - days

export async function duplicateDay(days: string[], slots: Slot[]): Promise<{message: string, status: number, prevSlots?: { day: string, slots: Slot[] }[]}> {
  const request = await fetch(`/api/database/scheduling/duplicate-day`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      days: days,
      slots: slots
    })
  })
  const response = await request.json();
  return response;
}

export async function undoDuplicateDay(prevSlots: { day: string, slots: Slot[] }[]): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/undo-duplicate-day`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prevSlots: prevSlots
    })
  })
  const response = await request.json();
  return response;
}
 
export async function deleteSlots(day: string): Promise<{message: string, status: number, prevSlots?: Slot[]}> {
  const request = await fetch(`/api/database/scheduling/delete-slots`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      day: day
    })
  })
  const response = await request.json();
  return response;
}

export async function undoDeleteSlots(prevSlots: Slot[]): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/undo-delete-slots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prevSlots: prevSlots
    })
  })
  const response = await request.json();
  return response;
}

export async function setRecurringDay(day: string, slots: Slot[]): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/set-recurring-day`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      day: day,
      slots: slots
    })
  })
  const response = await request.json();
  return response;
}

export async function disableRecurringDay(day: string, slots: Slot[]): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/disable-recurring-day`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      day: day,
      slots: slots
    })
  })
  const response = await request.json();
  return response;
}

// scheduling/meetings
