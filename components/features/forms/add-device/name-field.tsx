import { Text } from "@/components/typography";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NameFormState } from "@/lib/validation-schemas";

export function NameField(props: {
  serverState: string | undefined,
  clientState: NameFormState | undefined,
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="name" className="text-xs">Device name</Label>
      <Input
        aria-required="true"
        id="name"
        name="name"
        placeholder="Enter device name"
        spellCheck="false"
        className="text-xs placeholder:text-foreground"
      />
      <Text variant="p-base-thin" className="min-h-[1rem] text-xs text-right" role="alert">
        {props.serverState ? props.serverState : props.clientState?.errors?.name ? props.clientState.errors.name : ""}
      </Text>
    </div>
  )
}