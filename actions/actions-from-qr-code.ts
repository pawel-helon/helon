import { getDevice, getUser } from "@/actions/database-actions";
import { Device, ROLE, STATUS } from "@prisma/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function navigateUser(router: AppRouterInstance) {
  const gettingDevice = await getDevice();
  if (!gettingDevice.device) return;
  const device: Device = gettingDevice.device

  const gettingUser = await getUser();
  if (!gettingUser.user) return;
  const userRole: ROLE = gettingUser.user.role;

  if (device.status === STATUS.ACTIVE) {
    if (userRole === ROLE.ADMIN) {
      router.push("/features/qr-codes/actions/assign-owner");
    } else if (userRole === ROLE.OWNER) {
      router.push("/features/qr-codes/actions/give-access");
    } else {
      router.push("/features/qr-codes/actions/update-device-state");
    }
  } else {
    if (userRole === ROLE.ADMIN) {
      router.push("/features/qr-codes/actions/activate-device");
    } else {
      router.push("/features/qr-codes/actions/request-device-activation");
    }
  } 
}