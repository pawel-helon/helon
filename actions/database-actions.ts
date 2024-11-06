import { Device, Meeting, ROLE, Slot, STATE, STATUS, User } from "@prisma/client";

// helon

export async function unblockSlotsHelon(): Promise<{ message: string, status: number }> {
  const request = await fetch("/api/database/helon/unblock-slots", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function deletePastSlotsHelon(): Promise<{ message: string, status: number }> {
  const request = await fetch("/api/database/helon/delete-past-slots", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function getAvailableSlotsForDateHelon(date: string): Promise<{ message: string, slots: Slot[], status: number }> {
  const request = await fetch(`/api/database/helon/get-available-slots-for-date?date=${date}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function checkSlotAvailabilityHelon(slotId: string): Promise<{ message: string, status: number }> {
  const request = await fetch(`/api/database/helon/check-slot-availability?slotId=${slotId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function blockSlotHelon(slotId: string): Promise<{ message: string, status: number }> {
  const request = await fetch(`/api/database/helon/block-slot`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: slotId
    })
  })
  const response = await request.json();
  return response;
}

export async function getSlotHelon(slotId: string): Promise<{ message: string, slot: Slot, status: number }> {
  const request = await fetch(`/api/database/helon/get-slot?slotId=${slotId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function unblockSlotHelon(slotId: string): Promise<{ message: string, status: number }> {
  const request = await fetch(`/api/database/helon/unblock-slot`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: slotId
    })
  })
  const response = await request.json();
  return response;
}

export async function bookSlotHelon(slotId: string, fullName: string, phoneNumber: string, email: string, message: string | null): Promise<{ message: string, meeting: Meeting, status: number }> {
  const request = await fetch(`/api/database/helon/book-slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: slotId,
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email,
      message: message
    })
  })
  const response = await request.json();
  return response;
}

// features

// scheduling-book-meeting

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

export async function removeMeeting(meetingId: string): Promise<{message: string, status: number, meeting?: Meeting}> {
  const request = await fetch(`/api/database/scheduling/remove-meeting`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      meetingId: meetingId,
    })
  })
  const response = await request.json();
  return response;
}

export async function undoRemoveMeeting(meeting: Meeting): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/undo-remove-meeting`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      meeting: meeting,
    })
  })
  const response = await request.json();
  return response;
}

export async function rescheduleMeeting(meetingId: string, slotId: string): Promise<{message: string, status: number, prevSlotId?: string}> {
  const request = await fetch(`/api/database/scheduling/reschedule-meeting`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      meetingId: meetingId,
      slotId: slotId,
    })
  })
  const response = await request.json();
  return response;
}

export async function undoRescheduleMeeting(meetingId: string, slotId: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/database/scheduling/undo-reschedule-meeting`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      meetingId: meetingId,
      slotId: slotId,
    })
  })
  const response = await request.json();
  return response;
}

// q

// qr-codes

export async function getUser(userID: number): Promise<{message: string, status: number, user?: User}> {
  const request = await fetch(`/api/q/get-user?userID=${userID}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function getDevice(deviceID: number): Promise<{message: string, status: number, device?: Device}> {
  const request = await fetch(`/api/q/get-device?deviceID=${deviceID}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function updateDeviceStatus(deviceID: number, deviceStatus: STATUS): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/q/update-device-status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deviceID: deviceID,
      deviceStatus: deviceStatus
    })
  })
  const response = await request.json();
  return response;
}

export async function updateDeviceState(deviceID: number, deviceState: STATE): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/q/update-device-state`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deviceID: deviceID,
      deviceState: deviceState
    })
  })
  const response = await request.json();
  return response;
}

export async function updateUserRole(userID: number, userRole: ROLE): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/q/update-user-role`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userID: userID,
      userRole: userRole
    })
  })
  const response = await request.json();
  return response;
}

// tables

export async function updateRole(role: ROLE, ids: number[]): Promise<{ message: string, status: number }> {
  const request = await fetch("/api/q/update-role", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: role,
      ids: ids
    })
  })
  const response = await request.json();
  return response;
}

// docs

export async function updateRoleDocsFeature(role: ROLE): Promise<{message: string, status: number}> {
  const request = await fetch("/api/q/update-role-docs-feature", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: role,
    })
  })
  const response = await request.json();
  return response;
}
