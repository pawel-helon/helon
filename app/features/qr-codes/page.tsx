"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { getDevice, getUser, updateDeviceState, updateDeviceStatus, updateUserRole } from "@/actions/database-actions";
import { ActionsQRCodes } from "@/components/features/qr-codes/actions-qr-codes";
import { RadioGroup, RadioGroupItemQR as RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetTitleH as SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ROLE, STATE, STATUS } from "@prisma/client";

function capitalizeFirstLetterOnly(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
const userRoles = [ROLE.ADMIN, ROLE.OWNER, ROLE.ENDUSER];
const deviceStates = [STATE.OPENED, STATE.CLOSED];
const deviceStatuses = [STATUS.ACTIVE, STATUS.INACTIVE];

export default function QRCodesPage() {
  const isMobile = useMedia("(max-width: 480px)", false)
  const [selectedUserRole, setSelectedUserRole] = useState<ROLE>();
  const [selectedDeviceStatus, setSelectedDeviceStatus] = useState<STATUS>();
  const [selectedDeviceState, setSelectedDeviceState] = useState<STATE>();

  useEffect(() => {
    try {
      const init = async () => {
        const gettingUser = await getUser(1);
        if (!gettingUser.user) {
          toast.error(gettingUser.message);
          return;
        }
        setSelectedUserRole(gettingUser.user.role);
        
        const gettingDevice = await getDevice(1);
        if (!gettingDevice.device) {
          toast.error(gettingDevice.message);
          return;
        }
        setSelectedDeviceStatus(gettingDevice.device.status);
        setSelectedDeviceState(gettingDevice.device.state);
      }
      init();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Try again later.");
    }
  },[setSelectedUserRole, setSelectedDeviceStatus, setSelectedDeviceState])

  async function handleUserRoleChange(role: ROLE) {
    try {
      const updatingRole = await updateUserRole(1, role);
      if (updatingRole.status === 200) {
        setSelectedUserRole(role);
      } else {
        toast.error(updatingRole.message || 'Failed to update user role');
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }

  async function handleDeviceStatusChange(status: STATUS) {
    try {
      const updatingDeviceStatus = await updateDeviceStatus(1, status);
      if (updatingDeviceStatus.status === 200) {
        setSelectedDeviceStatus(status);
      } else {
        toast.error(updatingDeviceStatus.message || 'Failed to update device status');
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }

  async function handleDeviceStateChange(state: STATE) {
    try {
      const updatingDeviceState = await updateDeviceState(1, state);
      if (updatingDeviceState.status === 200) {
        setSelectedDeviceState(state);
      } else {
        toast.error(updatingDeviceState.message || 'Failed to update device state');
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }

  const options = (
    <>
      <div className="flex flex-col gap-2">
        <Label className="text-xs">Select user role</Label>
        <RadioGroup value={selectedUserRole} className="flex justify-start gap-2">
          {userRoles.map((role) => (
            <RadioGroupItem key={role} value={role} onClick={() => handleUserRoleChange(role)} asChild>
              {capitalizeFirstLetterOnly(role)}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-xs">Select device status</Label>
        <RadioGroup value={selectedDeviceStatus} className="flex gap-2">
          {deviceStatuses.map((status) => (
            <RadioGroupItem key={status} value={status} onClick={() => handleDeviceStatusChange(status)} asChild>
              {capitalizeFirstLetterOnly(status)}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-xs">Select device state</Label>
        <RadioGroup value={selectedDeviceState} className="flex gap-2">
          {deviceStates.map((state) => (
            <RadioGroupItem key={state} value={state} onClick={() => handleDeviceStateChange(state)} asChild>
              {capitalizeFirstLetterOnly(state)}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </div>
    </>
  )
  
  return (
    <>
      {isMobile ? (
        <Sheet open={true}>
          <SheetContent side="bottomNoPadding" className="min-h-[85vh]" aria-describedby="">
            <ActionsQRCodes />
            <div className="p-6">
              <SheetTitle className="text-center mb-8">QR codes</SheetTitle>
              <div className="w-full flex flex-col gap-8 mb-15">
                <div className="w-full flex flex-col items-center gap-2">
                  <Image src="/qr-demo.png" alt="QR code" width={200} height={200} className="rounded-md overflow-hidden"priority />
                </div>
                {options}
              </div>
              <div className="w-full absolute left-0 right-0 bottom-0 flex p-3">
                <Link href="/home" className="w-full">
                  <Button className="w-full pl-2 pr-4 shadow-black shadow-xl">
                    <ChevronLeft className="size-5 mr-1"/>Back
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true}>
          <DialogContent aria-describedby="" className="min-w-[600px]">
            <ActionsQRCodes />
            <DialogTitle className="mb-8">QR codes</DialogTitle>
            <div className="grid grid-cols-3 gap-8 mb-20">
              <div className="col-span-2 flex flex-col gap-8">
                {options}
              </div>
              <div className="col-span-1 flex flex-col gap-2">
                <Label className="text-xs">Scan qr code</Label>
                <Image src="/qr-demo.png" alt="QR code" width={200} height={200} className="rounded-md overflow-hidden"priority />
              </div>
            </div>
            <div className="w-full absolute left-0 right-0 bottom-0 flex justify-end p-6">
              <Link href="/home">
                <Button size="lg" className="pl-2 pr-4 shadow-black shadow-xl">
                  <ChevronLeft className="size-5 mr-1"/>Back
                </Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}