"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { RiLoaderFill } from "react-icons/ri"
import { useMedia } from "react-use"
import { toast } from "sonner"
import { Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogTitleH as DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { removeMeeting, undoRemoveMeeting } from "@/actions/database-actions"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function RemoveMeeting(props: {
  meetingId: string;
  userName: string;
  openDropdown: boolean;
  setOpenDropdown: (openDropdown: boolean) => void;
}) {
  const isMobile = useMedia("(max-width: 480px)", false)
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleRemoveMeeting() {
    try {
      startTransition(async () => {
        const removingMeeting = await removeMeeting(props.meetingId);
        if (removingMeeting.status !== 204) {
          toast.error(removingMeeting.message);
          return;
        }
        props.setOpenDropdown(!props.openDropdown)
        router.refresh();
        toast.success(removingMeeting.message, {
          action: {
            label: 'Undo',
            onClick: async () => {
              const undoingRemoveMeeting = await undoRemoveMeeting(removingMeeting.meeting!);
              if (undoingRemoveMeeting.status !== 201) {
                toast.error(undoingRemoveMeeting.message);
                return;
              }
              router.refresh();
              toast.success(undoingRemoveMeeting.message);
            }
          },
          duration: 3000
        });
      })
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }
  
  
  return (
    <>
      {isMobile ? (
        <Sheet onOpenChange={props.setOpenDropdown}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="justify-start text-left pl-2.5">
              Remove
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="min-h-[320px] flex flex-col flex-start bg-background-sh">
            <SheetTitle className="mb-8">
              Remove meeting
            </SheetTitle>
            <Text variant="p-base-thin" className="leading-relaxed">
              {`Are you sure you want to remove meeting with `}<span className="text-foreground-h">{props.userName}</span>{" ?"} 
            </Text>
            <div className="w-full absolute bottom-0 left-0 right-0 flex flex-col p-6 gap-2">
              <SheetClose asChild>
                <Button variant="ghost">
                  Cancel
                </Button>
              </SheetClose>
              <Button onClick={handleRemoveMeeting} disabled={isPending} className="min-w-[108px]">
                {isPending ? <RiLoaderFill className="size-5 animate-spin"/>: 'Remove'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog onOpenChange={props.setOpenDropdown}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="justify-start text-left pl-2.5 hover:cursor-default">
              Remove
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="" className="min-h-[320px] flex flex-col flex-start bg-background-sh">
            <DialogTitle className="mb-8">
              Remove meeting
            </DialogTitle>
            <Text variant="p-base-thin">
              {`Are you sure you want to remove meeting with `}<span className="text-foreground-h">{props.userName}</span>{" ?"} 
            </Text>
            <div className="w-full absolute bottom-0 left-0 right-0 flex justify-end p-6 gap-2">
              <DialogClose asChild>
                <Button variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleRemoveMeeting} disabled={isPending} className="min-w-[108px]">
                {isPending ? <RiLoaderFill className="size-5 animate-spin"/>: 'Remove'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}