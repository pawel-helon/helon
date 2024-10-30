"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { getDevice, updateDeviceState } from "@/actions/database-actions";
import { Dialog, DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitleH as SheetTitle } from "@/components/ui/sheet";
import { Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { STATE } from "@prisma/client";

function changeDeviceState(deviceState: STATE) {
  return deviceState === STATE.CLOSED ? STATE.OPENED : STATE.CLOSED;
}

function getMessage(deviceState: STATE | null) {
  return `Device has been ${deviceState === STATE.OPENED ? "opened" : "closed"}`;
}

export default function FeaturesQRCodesActionsUpdateDeviceState() {
  const [deviceState, setDeviceState] = useState<STATE | null>(null);
  const router = useRouter();
  const isMobile = useMedia("(max-width: 480px)", false);

  useEffect(() => {
    try {
      const init = async () => {
        const gettingDevice = await getDevice(1);
        if (!gettingDevice.device) {
          toast.error(gettingDevice.message)
          return 
        }
        
        setDeviceState(changeDeviceState(gettingDevice.device.state));

        const updatintDeviceState = await updateDeviceState(1, changeDeviceState(gettingDevice.device.state));
        if (updatintDeviceState.status !== 200) {
          toast.error(updatintDeviceState.message);
          return;
        }
      }
      init();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Try again later.");
    }
  },[deviceState])

  return (
    <>
      {isMobile ? (
        <Sheet open={true} onOpenChange={() => router.push("/features/qr-codes")}>
          <SheetContent side="bottom" aria-describedby="" className="min-h-[200px]">
            <SheetTitle className="text-center mb-8">Confirmation</SheetTitle>
            <Text variant="p-base-thin" className="text-center">{getMessage(deviceState)}</Text>
            <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-6">
              <Button onClick={() => router.push("/features/qr-codes")}>
                <ChevronLeft className="size-5 mr-1"/>Back
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true} onOpenChange={() => router.push("/features/qr-codes")}>
          <DialogContent aria-describedby="" className="min-h-[320px] flex flex-col">
            <DialogTitle className="mb-8">Confirmation</DialogTitle>
            <Text variant="p-base-thin">{getMessage(deviceState)}</Text>
            <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-2 p-6">
              <Button onClick={() => router.push("/features/qr-codes")}>
                Back
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
} 