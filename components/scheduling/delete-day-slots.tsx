'use client'

import { Dialog, DialogClose, DialogContent, DialogTitleH as DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Text } from "../typography";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteSlots } from "@/actions/server-actions";

export function DeleteDaySlots(props: {
  day: string;
  dropdownOpened: boolean;
  setDropdownOpened: (dropdownOpened: boolean) => void;
}) {
  const router = useRouter();
  async function handleDeleteSlots() {
    try {
      const deletingSlots = await deleteSlots(props.day);
      if (deletingSlots.status !== 204) {
        props.setDropdownOpened(!props.dropdownOpened)
        toast.error('An unexpected error occurred. Please try again later.')
        return
      }
      toast.success('Slots have been deleted');
      props.setDropdownOpened(!props.dropdownOpened)
      router.refresh();
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.')
    }
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="justify-start text-left pl-2.5">
          Delete slots
        </Button>
      </DialogTrigger>
      <DialogContent className="min-h-[320px] flex flex-col justify-start bg-background-sh">
        <DialogTitle className="mb-8">
          Delete slots
        </DialogTitle>
        <Text variant='p-base-thin' className="text-muted-foreground">
          Are you sure you want to delete slots? This action cannot be undone.
        </Text>
        <div className="w-full absolute bottom-0 left-0 right-0 flex justify-end p-6 gap-2">
          <DialogClose asChild>
            <Button variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleDeleteSlots}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}