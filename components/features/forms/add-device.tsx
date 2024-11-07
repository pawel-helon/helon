"use client"

import { useState, useTransition } from "react";
import { AddDeviceFormState, AddDeviceSchema } from "@/lib/validation-schemas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Text } from "@/components/typography";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SheetClose } from "@/components/ui/sheet";
import { DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiLoaderFill } from "react-icons/ri";

const USERS = ["Alex Atkins", "Bob Berkley", "Clair Clarkson", "David Daniels", "Ethan Edwards", "Frank Fisher", "Greg Goodwin", "Hank Henderson", "Ian Igins" ]

const phonePrefixesNorthAmerica = [
  { value: "001", label: "+1" },
  { value: "0052", label: "52" },
  { value: "00501", label: "501" },
  { value: "00506", label: "506" },
  { value: "00502", label: "502" },
  { value: "00504", label: "504" },
  { value: "00505", label: "505" },
  { value: "00507", label: "507" },
  { value: "00503", label: "503" },
];

const phonePrefixesEurope = [
  { value: "0049", label: "+49" },
  { value: "0033", label: "+33" },
  { value: "0034", label: "34" },
  { value: "0039", label: "+39" },
  { value: "0044", label: "+44" },
  { value: "0031", label: "+31" },
  { value: "0032", label: "+32" },
  { value: "0043", label: "+43" },
  { value: "0041", label: "+41" },
  { value: "0046", label: "+46" },
];


export function AddDeviceForm() {
  const router = useRouter();
  const [state, setState] = useState<AddDeviceFormState | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
   

  async function handleSubmit(formData: FormData) {
    const validatedFields = AddDeviceSchema.safeParse({
      deviceName: formData.get("deviceName"),
      owner: formData.get("owner"),
      emei: formData.get("emei"),
      model: formData.get("model"),
      SIM: formData.get("SIM"),
    })
    
    if (!validatedFields.success) {
      setState({ errors: validatedFields.error.flatten().fieldErrors });
      return;
    }

    const { deviceName } = validatedFields.data;
    
    try {
      startTransition(async () => {
        setTimeout(() => {
          toast.success(`${deviceName} device has been added to the platform`);
          router.refresh();
        }, 1000)
      })
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }
  
  return (
    <form action={handleSubmit} className="flex flex-col gap-3 xs:gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="deviceName" className="text-xs">Device name</Label>
        <Input
          id="deviceName"
          name="deviceName"
          placeholder="Enter device name"
          spellCheck="false"
          className="text-xs placeholder:text-foreground"
        />
        {state?.errors?.deviceName ? (
          <Text variant="p-small-thin" className="text-right">{state.errors.deviceName}</Text>
        ) : (
          <div className="h-[1rem]" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="owner" className="text-xs">Owner</Label>
        <Select name="owner">
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Select owner" />
          </SelectTrigger>
          <SelectContent className="bg-background-sh">
            <SelectGroup>
              {USERS.map((user) => (
                <SelectItem key={user} value={user} className="text-xs">
                  {user}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {state?.errors?.owner ? (
          <Text variant="p-small-thin" className="text-right">{state.errors.owner}</Text>
        ) : (
          <div className="h-[1rem]" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="emei" className="text-xs">EMEI</Label>
        <Input
          id="emei"
          name="emei"
          placeholder="Enter EMEI number"
          type="number"
          spellCheck="false"
          className="text-xs placeholder:text-foreground"
        />
        {state?.errors?.emei ? (
          <Text variant="p-small-thin" className="text-right">{state.errors.emei}</Text>
        ) : (
          <div className="h-[1rem]" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="model" className="text-xs">Model</Label>
        <Select name="model">
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent className="bg-background-sh">
            <SelectGroup>
              <SelectItem value="MP-28" className="text-xs">MP-28</SelectItem>
              <SelectItem value="NX-356" className="text-xs">NX-356</SelectItem>
              <SelectItem value="MZ-12" className="text-xs">MZ-12</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {state?.errors?.model ? (
          <Text variant="p-small-thin" className="text-right">{state.errors.model}</Text>
        ) : (
          <div className="h-[1rem]" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="SIM" className="text-xs">Phone number</Label>
        <div className="flex gap-2">
          <Select name="prefix" defaultValue="001">
            <SelectTrigger className="w-[100px] text-xs">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent className="bg-background-sh">
              <SelectGroup>
                <SelectLabel className="text-xs">North America</SelectLabel>
                <Separator className="my-1" />
                {phonePrefixesNorthAmerica.map((prefix) => (
                  <SelectItem key={prefix.value} value={prefix.value} className="text-xs">{prefix.label}</SelectItem>
                ))}
              </SelectGroup>
              <Separator className="my-1" />
              <SelectGroup>
                <SelectLabel className="text-xs">Europe</SelectLabel>
                <Separator className="my-1" />
                {phonePrefixesEurope.map((p) => (
                  <SelectItem key={p.value} value={p.value} className="text-xs">{p.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            id="SIM"
            name="SIM"
            placeholder="Enter phone number"
            spellCheck="false"
            className="text-xs w-full placeholder:text-foreground"
          />
        </div>
        {state?.errors?.SIM ? (
          <Text variant="p-small-thin" className="text-right">{state.errors.SIM}</Text>
        ) : (
          <div className="h-[1rem]" />
        )}
      </div>
      <div className="absolute xs:fixed bottom-0 left-0 right-0 flex flex-col xs:flex-row justify-end px-3 xs:px-6 py-3 gap-2 bg-background-sh">
      <div className="xs:hidden">
        <SheetClose asChild>
          <Button variant="ghost" onClick={() => router.push("/home")} className="w-full">Cancel</Button>
        </SheetClose>
      </div>
      <div className="hidden xs:block">
        <DialogClose asChild>
          <Button variant="ghost" onClick={() => router.push("/home")}>Cancel</Button>
        </DialogClose>
      </div>
        <Button type="submit" disabled={isPending} className="min-w-[120px]">
          {isPending ? <RiLoaderFill className="size-5 animate-spin" /> : "Add device"}
        </Button>
      </div>
    </form>
  )
}