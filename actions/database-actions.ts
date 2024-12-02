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
