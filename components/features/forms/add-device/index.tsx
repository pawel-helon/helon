"use client"

import { TransitionStartFunction, useState } from "react";
import { toast } from "sonner";
import { addDevice, checkDeviceEMEI, checkDeviceName, checkDevicePhoneNumber } from "@/actions/database-actions";
import { NameFormState, NameSchema, EMEIFormState, EMEISchema, ModelFormState, ModelSchema, OwnerFormState, OwnerSchema, PhoneNumberFormState, PhoneNumberSchema } from "@/lib/validation-schemas";
import { NameField } from "./name-field";
import { OwnerField } from "./owner-field";
import { EmeiField } from "./emei-field";
import { ModelField } from "./model-field";
import { PhoneNumberField } from "./phone-number-field";

export function AddDeviceForm(props: { children: React.ReactNode, startTransition: TransitionStartFunction }) {
  const [nameClientState, setNameClientState] = useState<NameFormState | undefined>(undefined);
  const [ownerClientState, setOwnerClientState] = useState<OwnerFormState | undefined>(undefined);
  const [emeiClientState, setEmeiClientState] = useState<EMEIFormState | undefined>(undefined);
  const [modelClientState, setModelClientState] = useState<ModelFormState | undefined>(undefined);
  const [phoneNumberClientState, setPhoneNumberClientState] = useState<PhoneNumberFormState | undefined>(undefined);
  
  const [nameServerState, setNameServerState] = useState<string | undefined>(undefined);
  const [emeiServerState, setEmeiServerState] = useState<string | undefined>(undefined);
  const [phoneNumberServerState, setPhoneNumberServerState] = useState<string | undefined>(undefined);

  async function handleSubmit(formData: FormData) {
    try {
      // Name field validation
      const validatedName = NameSchema.safeParse({
        name: formData.get("name")
      })
      
      if (!validatedName.success) {
        setNameClientState({ errors: validatedName.error.flatten().fieldErrors });
        return;
      }
  
      const { name } = validatedName.data;
  
      const checkingName = await checkDeviceName(name);
      if (checkingName.status !== 204) {
        setNameServerState(checkingName.message);
        return;
      } 
      setNameServerState(undefined);
      setNameClientState(undefined);

      // Owner field validation
      const validatedOwner = OwnerSchema.safeParse({
        owner: formData.get("owner")
      })

      if (!validatedOwner.success) {
        setOwnerClientState({ errors: validatedOwner.error.flatten().fieldErrors });
        return;
      }
      setOwnerClientState(undefined);

      // EMEI field validation
      const validatedEMEI = EMEISchema.safeParse({
        emei: formData.get("emei")
      })
      
      if (!validatedEMEI.success) {
        setEmeiClientState({ errors: validatedEMEI.error.flatten().fieldErrors });
        return;
      }
  
      const { emei } = validatedEMEI.data
  
      const checkingEMEI = await checkDeviceEMEI(emei);
      if (checkingEMEI.status !== 204) {
        setEmeiServerState(checkingEMEI.message);
        return;
      }
      setEmeiServerState(undefined);
      setEmeiClientState(undefined);

      // Model field validation
      const validatedModel = ModelSchema.safeParse({
        model: formData.get("model")
      })

      if (!validatedModel.success) {
        setModelClientState({ errors: validatedModel.error.flatten().fieldErrors })
        return;
      }
      setModelClientState(undefined);
      
      // Phone number field validation
      const validatedPhoneNumber = PhoneNumberSchema.safeParse({
        SIM: formData.get("SIM")
      })
      
      if (!validatedPhoneNumber.success) {
        setPhoneNumberClientState({ errors: validatedPhoneNumber.error.flatten().fieldErrors });
        return;
      }
  
      const { SIM } = validatedPhoneNumber.data
      const prefix = formData.get("prefix")
      const phoneNumber = `${prefix}-${SIM}`
  
      const checkingPhoneNumber = await checkDevicePhoneNumber(phoneNumber);
      if (checkingPhoneNumber.status !== 204) {
        setPhoneNumberServerState(checkingPhoneNumber.message);
        return;
      }
      setPhoneNumberServerState(undefined);
      setPhoneNumberClientState(undefined);

      // Adding device to the platform
      props.startTransition(async () => {
        const addingDevice = await addDevice(name, emei, phoneNumber);
        if (addingDevice.status !== 201) {
          toast.error(addingDevice.message);
          return;
        }
        toast.success(addingDevice.message);
        setTimeout(() => {
          window.location.reload();
        },500)
      })
      
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }
  
  return (
    <form action={handleSubmit} className="flex flex-col gap-3 xs:gap-4">
      <NameField serverState={nameServerState} clientState={nameClientState} />
      <OwnerField clientState={ownerClientState} />
      <EmeiField serverState={emeiServerState} clientState={emeiClientState} />
      <ModelField clientState={modelClientState} />
      <PhoneNumberField serverState={phoneNumberServerState} clientState={phoneNumberClientState} />
      {props.children}
    </form>
  )
}