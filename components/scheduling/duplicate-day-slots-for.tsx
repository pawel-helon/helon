'use client'

import { Dialog, DialogClose, DialogContent, DialogTitleH as DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "../ui/label";
import { Slot } from "@prisma/client";
import { DuplicateDaySlotsFormState, DuplicateDaySlotsSchema } from "@/lib/validation-schemas";
import { duplicateDaySlotsFor } from "@/actions/server-actions";
import { RiLoaderFill } from "react-icons/ri";
import { Text } from "../typography";

const DAYSOFWEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function DuplicateDaySlotsFor(props: {
  day: string;
  slots: Slot[];
  daysExceptToday: string[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [state, setState] = useState<DuplicateDaySlotsFormState | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const validatedFields = DuplicateDaySlotsSchema.safeParse({
      day: formData.get('day')
    })
    
    if (!validatedFields.success) {
      setState({ errors: validatedFields.error.flatten().fieldErrors });
      return;
    }

    const { day } = validatedFields.data;

    try {
      startTransition(async () => {
        const duplicatingDaySlotsFor = await duplicateDaySlotsFor(day, props.slots)
        if (duplicatingDaySlotsFor.status !== 201 ) {
          toast.error(duplicatingDaySlotsFor.message)
        } else {
          router.refresh();
          setOpen(!open);
          toast.success(duplicatingDaySlotsFor.message);
        }
      })
    } catch (e) {
      toast.error('An unexpected error occurred. Please try again later.')
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='w-[100px] justify-start rounded-r-none text-left pl-2.5'>
          Duplicate
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby='' className='min-h-[320px] flex flex-col flex-start bg-background-sh'>
        <DialogTitle className='mb-8'>Duplicate</DialogTitle>
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
                        <SelectItem key={d} value={d}>
                          {DAYSOFWEEK[new Date(d).getDay()]}
                        </SelectItem>
                      )
                    })}
                  </>
                </SelectGroup>
              </SelectContent>
            </Select>
            {state?.errors?.day ? (
              <Text variant='p-small-thin' className='text-right'>
                {state.errors.day}
              </Text>
            ) : (
              <div className="h-[1rem]"/>
            )}
          </div>
          <div className='absolute bottom-0 left-0 w-full flex justify-end p-6'>
            <DialogClose asChild>
              <Button type='button' variant='ghost'>Cancel</Button>
            </DialogClose>
            <Button disabled={isPending} type='submit' className='min-w-[88px]'>
              {isPending ? <RiLoaderFill className="size-5 animate-spin" /> : "Duplicate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}