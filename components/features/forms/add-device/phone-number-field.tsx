import { Text } from "@/components/typography";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PhoneNumberFormState } from "@/lib/validation-schemas";

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

export function PhoneNumberField(props: {
  serverState: string | undefined,
  clientState: PhoneNumberFormState | undefined,
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="SIM" className="text-xs">Phone number</Label>
      <div className="flex gap-2">
        <Select name="prefix" defaultValue="001">
          <SelectTrigger className="w-[100px] text-xs">
            <SelectValue />
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
      <Text variant="p-base-thin" className="min-h-[1rem] text-xs text-right">
        {props.serverState ? props.serverState : props.clientState?.errors?.SIM ? props.clientState.errors.SIM : " "}
      </Text>
    </div>
  )
}