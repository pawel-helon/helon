"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { getDevice, updateDeviceStatus } from "@/actions/database-actions";
import { Dialog, DialogContentWithoutClose as DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContentWithoutClose as SheetContent, SheetTitleH as SheetTitle } from "@/components/ui/sheet";
import { Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { STATUS } from "@prisma/client";
import { ActionsQRCodes } from "@/components/features/qr-codes/actions-qr-codes";

export default function FeaturesQRCodesActionsUpdateDeviceState() {
  const router = useRouter();
  const isMobile = useMedia("(max-width: 480px)", false);

  useEffect(() => {
    try {
      const init = async () => {
        const gettingDevice = await getDevice();
        if (!gettingDevice.device) {
          toast.error(gettingDevice.message)
          return 
        }
        if (gettingDevice.device.status === STATUS.ACTIVE) {
          router.push("/features/qr-codes")
        }

        const updatintDeviceStatus = await updateDeviceStatus(STATUS.ACTIVE);
        if (updatintDeviceStatus.status !== 200) {
          toast.error(updatintDeviceStatus.message);
          return;
        }
      }
      init();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Try again later.");
    }
  },[router])

  return (
    <>
      {isMobile ? (
        <Sheet open={true} onOpenChange={() => router.push("/features/qr-codes")}>
          <SheetContent side="bottom" aria-describedby="" className="min-h-[200px]">
            <SheetTitle className="text-center mb-8">Confirmation</SheetTitle>
            <Text variant="p-base-thin" className="text-center">Device has been activated</Text>
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
            <Text variant="p-base-thin">Device has been activated</Text>
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