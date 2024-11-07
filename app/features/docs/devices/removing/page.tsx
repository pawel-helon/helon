import { Text } from "@/components/typography";

export default async function RemovingDocPage() {
  return (
    <div className="h-min col-span-3 flex flex-col gap-4 p-4 pb-6 text-card-foreground border border-border rounded-lg bg-background shadow-black shadow-2xl">
      <Text variant="h3">How to remove device?</Text>
      <Text variant="p-base-thin" className="leading-normal">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris.
      </Text>
    </div>
  );
}
