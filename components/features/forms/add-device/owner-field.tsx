import { Text } from "@/components/typography";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OwnerFormState } from "@/lib/validation-schemas";

const USERS = ["Alex Atkins", "Bob Berkley", "Clair Clarkson", "David Daniels", "Ethan Edwards", "Frank Fisher", "Greg Goodwin", "Hank Henderson", "Ian Igins" ]

export function OwnerField(props: {
  clientState: OwnerFormState | undefined,
}) {
  return (
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
      <Text variant="p-base-thin" className="min-h-[1rem] text-xs text-right" role="alert">
        {props.clientState?.errors?.owner ? props.clientState.errors.owner : " "}
      </Text>
    </div>
  )
}