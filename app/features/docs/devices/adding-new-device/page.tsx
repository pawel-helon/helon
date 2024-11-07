import { Text } from "@/components/typography";

export default async function AddingNewDeviceDocPage() {
  return (
    <div className="h-min col-span-3 flex flex-col gap-4 p-4 pb-6 text-card-foreground border border-border rounded-lg bg-background shadow-black shadow-2xl">
      <Text variant="h3">How to add new device?</Text>
      <div className="space-y-2">
        <Text variant="p-base-thin" className="leading-normal">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum
        </Text>
        <Text variant="p-base-thin" className="leading-normal">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </Text>
      </div>
    </div>
  );
}
