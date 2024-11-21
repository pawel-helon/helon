"use client"

import { useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitleH as SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const users = ["Bob Berkley", "Clair Clarkson", "David Daniels", "Ethan Edwards", "Frank Franklin" ]

export default function FeaturesQRCodesActionsAssignOwner() {
  const router = useRouter();
  const isMobile = useMedia("(max-width: 480px)", false);

  function handleSubmit() {
    router.push("/features/qr-codes");
    toast.success("You have assigned new owner of this device")
  }
  
  return (
    <>
      {isMobile ? (
        <Sheet open={true} onOpenChange={() => router.push("/features/qr-codes")}>
          <SheetContent side="bottom" aria-describedby="">
            <SheetTitle className="text-center mb-8">Assign new owner</SheetTitle>
            <div className="mb-[116px]">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select new owner" />
                </SelectTrigger>
                <SelectContent className="bg-background-sh">
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
            <DialogTitle className="mb-8">Assign new owner</DialogTitle>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select new owner" className="w-full" />
              </SelectTrigger>
              <SelectContent className="bg-background-sh">
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