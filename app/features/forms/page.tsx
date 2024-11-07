"use client"

import { useMedia } from "react-use"
import { Dialog, DialogContentWithoutCloseNoPadding as DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContentWithoutClose as SheetContent, SheetTitleH as SheetTitle} from "@/components/ui/sheet";
import { ActionsForms } from "@/components/features/forms/actions-forms";
import { AddDeviceForm } from "@/components/features/forms/add-device";

export default function FormsPage() {
  const isMobile = useMedia("(max-width: 480px)", false);
  return (
    <>
      {isMobile ? (
        <Sheet open={true}>
          <SheetContent side="bottomNoPadding" className="min-h-[80vh]" aria-describedby="">
            <ActionsForms />
            <div className="p-3">
              <SheetTitle className="text-center mb-8">Add device</SheetTitle>
              <AddDeviceForm />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true}>
          <DialogContent className="min-h-[640px] flex flex-col justify-start" aria-describedby="">
            <ActionsForms />
            <div className="p-6">
              <DialogTitle className="mb-8">Add device</DialogTitle>
              <AddDeviceForm />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}