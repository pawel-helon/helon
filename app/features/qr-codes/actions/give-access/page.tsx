"use client"

import { useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitleH as SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const users = ["Greg Goodwin", "Hank Henderson", "Ian Igins", "Jack Jones"]

export default function FeaturesQRCodesActionsGiveAccess() {
  const router = useRouter();
  const isMobile = useMedia("(max-width: 480px)", false);

  function handleSubmit() {
    router.push("/features/qr-codes");
    toast.success("You have graneted new user access to this device")
  }
  
  return (
    <>
      {isMobile ? (
        <Sheet open={true} onOpenChange={() => router.push("/features/qr-codes")}>
          <SheetContent side="bottom" aria-describedby="">
            <SheetTitle className="text-center mb-8">Give access</SheetTitle>
            <div className="mb-[116px]">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {users.map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-6">
              <Button variant="ghost">
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true} onOpenChange={() => router.push("/features/qr-codes")}>
          <DialogContent aria-describedby="" className="min-h-[320px] flex flex-col">
            <DialogTitle className="mb-8">Give access</DialogTitle>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select user" className="w-full" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {users.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-2 p-6">
              <Button variant="ghost">
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
} 