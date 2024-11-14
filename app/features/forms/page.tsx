"use client"

import { useMedia } from "react-use"
import { Dialog, DialogClose, DialogContentWithoutCloseNoPadding as DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetClose, SheetContentWithoutClose as SheetContent, SheetTitleH as SheetTitle} from "@/components/ui/sheet";
import { ActionsForms } from "@/components/features/forms/actions-forms";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AddDeviceForm } from "@/components/features/forms/add-device/index";
import { useTransition } from "react";
import { RiLoaderFill } from "react-icons/ri";

export default function FormsPage() {
  const [isPending, startTransition] = useTransition();
  const isMobile = useMedia("(max-width: 480px)", false);
  const router = useRouter();
  return (
    <>
      {isMobile ? (
        <Sheet open={true}>
          <SheetContent side="bottomNoPadding" className="min-h-[80vh]" aria-describedby="">
            <ActionsForms />
            <div className="p-3">
              <SheetTitle className="text-center mb-8">Add device</SheetTitle>
              <AddDeviceForm startTransition={startTransition}>
                <div className="absolute bottom-0 left-0 right-0 flex flex-col p-3 gap-2 bg-background-sh">
                  <SheetClose asChild>
                    <Button variant="ghost" onClick={() => router.push("/home")} className="w-full">Cancel</Button>
                  </SheetClose>
                  <Button type="submit" disabled={isPending} className="min-w-[120px]">
                    {isPending ? <RiLoaderFill className="size-5 animate-spin" /> : "Add device"}
                  </Button>
                </div>
              </AddDeviceForm>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true}>
          <DialogContent className="min-h-[640px] flex flex-col justify-start" aria-describedby="">
            <ActionsForms />
            <div className="p-6">
              <DialogTitle className="mb-8">Add device</DialogTitle>
              <AddDeviceForm startTransition={startTransition} >
                <div className="fixed bottom-0 left-0 right-0 flex justify-end px-6 pb-6 gap-2 bg-background-sh">
                  <DialogClose asChild>
                    <Button variant="ghost" onClick={() => router.push("/home")}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isPending} className="min-w-[120px]">
                    {isPending ? <RiLoaderFill className="size-5 animate-spin" /> : "Add device"}
                  </Button>
                </div>
              </AddDeviceForm>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}