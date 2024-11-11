import { Text } from "@/components/typography";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMEIFormState } from "@/lib/validation-schemas";

export function EmeiField(props: {
  serverState: string | undefined,
  clientState: EMEIFormState | undefined,
}) {
  return (
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
      <Text variant="p-base-thin" className="min-h-[1rem] text-xs text-right">
        {props.serverState ? props.serverState : props.clientState?.errors?.emei ? props.clientState.errors.emei : " "}
      </Text>
    </div>
  )
}