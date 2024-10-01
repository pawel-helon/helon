import { Dialog, DialogClose, DialogContent, DialogTitleH as DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "../ui/label";
import { Slot } from "@prisma/client";

const DAYSOFWEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function DuplicateSlotFor(props: {
  slot: Slot;
  daysExceptToday: string[];
  actionsOnSlotDropdownOpened: boolean;
  setActionsOnSlotDropdownOpened: (actionsOnSlotDropdownOpened: boolean) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const day = formData.get('day');

    //validation

    startTransition(async () => {
      try {
        const settingSlotRecurring = await duplicateSlotFor(slot, day)
        if (settingSlotRecurring.status !== 201 ) {
          toast.error(settingSlotRecurring.message)
        } else {
          router.refresh();
          toast.success(settingSlotRecurring.message);
          props.setActionsOnSlotDropdownOpened(!props.actionsOnSlotDropdownOpened);
        }
      } catch {
        toast.error('An error occurred. Please try again later.');
      }
    })
    
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className='justify-start text-left pl-2.5'>
          Duplicate slot for
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby='' className='min-h-[320px] flex flex-col flex-start bg-background-sh'>
        <DialogTitle className='mb-8'>Duplicate slot for</DialogTitle>
        <form action={handleSubmit}>
          <div className='flex flex-col gap-2'>
            <Label>Day</Label>
            <Select name='day'>
              <SelectTrigger>
                <SelectValue placeholder='Select day'/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <>
                    {props.daysExceptToday.map((d) => {
                      return (
                        <SelectItem key={d} value={String(new Date(d).getDay())}>
                          {DAYSOFWEEK[new Date(d).getDay()]}
                        </SelectItem>
                      )
                    })}
                  </>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className='absolute bottom-0 left-0 w-full flex justify-end p-6'>
            <DialogClose asChild>
              <Button type='button' variant='ghost'>Cancel</Button>
            </DialogClose>
            <Button type='submit'>
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}