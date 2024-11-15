import { getDevice, getUser } from "@/actions/database-actions";
import { Device, ROLE, STATUS } from "@prisma/client";
import { redirect } from "next/navigation";

export async function navigateUser() {
  const gettingDevice = await getDevice(1);
  if (!gettingDevice.device) return;
  const device: Device = gettingDevice.device

  const gettingUser = await getUser(1);
  if (!gettingUser.user) return;
  const userRole: ROLE = gettingUser.user.role;

  if (device.status === STATUS.ACTIVE) {
    if (userRole === ROLE.ADMIN) {
      redirect("https://helon.vercel.app/features/qr-codes/actions/assign-owner");
    } else if (userRole === ROLE.OWNER) {
      redirect("https://helon.vercel.app/features/qr-codes/actions/give-access");
    } else {
      redirect("https://helon.vercel.app/features/qr-codes/actions/update-device-state");
    }
  } else {
    if (userRole === ROLE.ADMIN) {
      redirect("https://helon.vercel.app/features/qr-codes/actions/activate-device");
    } else {
      redirect("https://helon.vercel.app/features/qr-codes/actions/request-device-activation");
    }
  } 
}