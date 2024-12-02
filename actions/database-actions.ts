import { Device, Meeting, ROLE, Slot, STATE, STATUS, User } from "@prisma/client";

// helon
export async function unblockSlotsHelon(): Promise<{ message: string, status: number }> {
  const request = await fetch("/api/helon/unblock-slots", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function deletePastSlotsHelon(): Promise<{ message: string, status: number }> {
  const request = await fetch("/api/helon/delete-past-slots", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function getAvailableSlotsForDateHelon(date: string): Promise<{ message: string, slots: Slot[], status: number }> {
  const request = await fetch(`/api/helon/get-available-slots-for-date?date=${date}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function checkSlotAvailabilityHelon(slotId: string): Promise<{ message: string, status: number }> {
  const request = await fetch(`/api/helon/check-slot-availability?slotId=${slotId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function blockSlotHelon(slotId: string): Promise<{ message: string, status: number }> {
  const request = await fetch(`/api/helon/block-slot`, {
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
  const request = await fetch(`/api/helon/get-slot?slotId=${slotId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function unblockSlotHelon(slotId: string): Promise<{ message: string, status: number }> {
  const request = await fetch(`/api/helon/unblock-slot`, {
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
  const request = await fetch(`/api/helon/book-slot`, {
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

// qr-codes
export async function getUser(): Promise<{message: string, status: number, user?: User}> {
  const request = await fetch(`/api/features/get-user`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function getDevice(): Promise<{message: string, status: number, device?: Device}> {
  const request = await fetch(`/api/features/get-device`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function updateDeviceStatus(deviceStatus: STATUS): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/update-device-status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deviceStatus: deviceStatus
    })
  })
  const response = await request.json();
  return response;
}

export async function updateDeviceState(deviceState: STATE): Promise<{message: string, status: number, device?: Device}> {
  const request = await fetch(`/api/features/update-device-state`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deviceState: deviceState
    })
  })
  const response = await request.json();
  return response;
}

export async function updateUserRole(userRole: ROLE): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/update-user-role`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userRole: userRole
    })
  })
  const response = await request.json();
  return response;
}

// tables
export async function getUsers(): Promise<{message: string, status: number, users?: User[]}> {
  const request = await fetch("/api/featuresq/get-users", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
  const response = await request.json();
  return response;
}

export async function updateRole(role: ROLE, ids: number[]): Promise<{ message: string, status: number }> {
  const request = await fetch("/api/features/update-role", {
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
export async function getRole(): Promise<{message: string, status: number, role: ROLE}> {
  const request = await fetch("/api/features/get-role", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function updateRoleDocsFeature(role: ROLE): Promise<{message: string, status: number}> {
  const request = await fetch("/api/features/update-role-docs-feature", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: role,
    })
  })
  const response = await request.json();
  return response;
}

// forms
export async function checkDeviceEMEI(emei: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/check-device-emei?emei=${emei}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
  const response = await request.json();
  return response;
}

export async function checkDevicePhoneNumber(phoneNumber: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/check-device-phone-number?phoneNumber=${phoneNumber}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
  const response = await request.json();
  return response;
}

export async function checkDeviceName(name: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/check-device-name?name=${name}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
  const response = await request.json();
  return response;
}

export async function addDevice(deviceName: string, emei: string, phoneNumber: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/add-device`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deviceName: deviceName,
      emei: emei,
      phoneNumber: phoneNumber
    })
  })
  const response = await request.json();
  return response;
}

// scheduling

export async function addRecurringSlot(day: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/scheduling/add-recurring-slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      day: day
    })
  })
  const response = await request.json();
  return response;
}

export async function addSlot(day: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/scheduling/add-slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      day: day
    })
  })
  const response = await request.json();
  return response;
}

export async function deleteSlots(day: string): Promise<{message: string, status: number, prevSlots?: Slot[]}> {
  const request = await fetch(`/api/features/scheduling/delete-slots`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      day: day
    })
  })
  const response = await request.json();
  return response;
}

export async function disableRecurringDay(day: string, slots: Slot[]): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/scheduling/disable-recurring-day`, {
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

export async function setRecurringDay(day: string, slots: Slot[]): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/scheduling/set-recurring-day`, {
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

export async function undoDeleteSlots(prevSlots: Slot[]): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/scheduling/undo-delete-slots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prevSlots: prevSlots
    })
  })
  const response = await request.json();
  return response;
}

export async function deletePastSlots(): Promise<{ message: string, status: number }> {
  const request = await fetch("/api/features/scheduling/delete-past-slots", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function duplicateDay(days: string[], slots: Slot[]): Promise<{message: string, status: number, prevSlots?: { day: string, slots: Slot[] }[]}> {
  const request = await fetch(`/api/features/scheduling/duplicate-day`, {
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
  const request = await fetch(`/api/features/scheduling/undo-duplicate-day`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prevSlots: prevSlots
    })
  })
  const response = await request.json();
  return response;
}

export async function deleteSlot(slotId: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/scheduling/delete-slot`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: slotId
    })
  })
  const response = await request.json();
  return response;
}

export async function undoDeleteSlot(dateTime: Date): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/scheduling/undo-delete-slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dateTime: dateTime,
    })
  })
  const response = await request.json();
  return response;
}

export async function setRecurringSlot(slotId: string, dateTime: Date): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/scheduling/set-recurring-slot`, {
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

export async function disableRecurringSlot(slotId: string, dateTime: Date): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/scheduling/disable-recurring-slot`, {
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

export async function updateSlotHour(slotId: string, dateTime: Date, hour: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/scheduling/update-slot-hour`, {
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

export async function updateSlotMinute(slotId: string, dateTime: Date, minute: string): Promise<{message: string, status: number}> {
  const request = await fetch(`/api/features/scheduling/update-slot-minute`, {
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

export async function removeMeeting(meetingId: string): Promise<{message: string, status: number, meeting?: Meeting}> {
  const request = await fetch(`/api/features/scheduling/remove-meeting`, {
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
  const request = await fetch(`/api/features/scheduling/undo-remove-meeting`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      meeting: meeting,
    })
  })
  const response = await request.json();
  return response;
}

export async function getAvailableSlotsForDate(date: string): Promise<{ message: string, slots: Slot[], status: number }> {
  const request = await fetch(`/api/features/get-available-slots-for-date?date=${date}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function checkSlotAvailability(slotId: string): Promise<{ message: string, status: number }> {
  const request = await fetch(`/api/features/check-slot-availability?slotId=${slotId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const response = await request.json();
  return response;
}

export async function rescheduleMeeting(meetingId: string, slotId: string): Promise<{message: string, status: number, prevSlotId?: string}> {
  const request = await fetch(`/api/features/scheduling/reschedule-meeting`, {
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
  const request = await fetch(`/api/features/scheduling/undo-reschedule-meeting`, {
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