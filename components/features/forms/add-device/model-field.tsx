import { Text } from "@/components/typography";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModelFormState } from "@/lib/validation-schemas";

const MODELS = ["MP-28", "NX-356", "MZ-12"];

export function ModelField(props: {
  clientState: ModelFormState | undefined,
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="model" className="text-xs">Model</Label>
      <Select name="model">
        <SelectTrigger className="text-xs">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent className="bg-background-sh">
          <SelectGroup>
            {MODELS.map((model) => (
              <SelectItem key={model} value={model} className="text-xs">{model}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Text variant="p-base-thin" className="min-h-[1rem] text-xs text-right" role="alert">
        {props.clientState?.errors?.model ? props.clientState.errors.model : " "}
      </Text>
    </div>
  )
}