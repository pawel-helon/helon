import { ChevronLeft, ChevronRight } from "lucide-react";
import { RiLoaderFill } from "react-icons/ri";
import { Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default async function LoadingAvailability() {
  return (
    <>
      <div className="block xs:hidden">
        <div className="flex flex-col my-[4rem]">
          <div className="w-full flex justify-end">
            <div className="flex gap-2 items-center">
              <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                <ChevronLeft size={18}/>
              </Button>
              <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
                <ChevronRight size={18}/>
              </Button>
            </div>
          </div>
          <Text variant="h1">Scheduling</Text>
        </div>
        <div className="h-11 mb-8 flex justify-start border-b border-border" />
        <div className="w-full flex justify-end items-center gap-2 mb-4">
          <Label className="text-xs text-muted-foreground">Recurring only</Label>
          <Switch checked={false} />
        </div>
        <div className="grid grid-cols-1 gap-2 mb-16">
          <div style={{ aspectRatio: "1" }} className="animate-fade-in transition-all duration-300 relative h-full col-span-1 flex justify-center items-center border rounded-md border-border shadow-lg shadow-black bg-background-sh">
            <RiLoaderFill className="size-6 animate-spin" />
          </div>
          <div className="h-[52px] animate-fade-in transition-all duration-300 relative col-span-1 flex justify-center items-center border rounded-md border-border shadow-lg shadow-black bg-background-sh">
            <RiLoaderFill className="size-6 animate-spin" />
          </div>
          <div className="h-[52px] animate-fade-in transition-all duration-300 relative col-span-1 flex justify-center items-center border rounded-md border-border shadow-lg shadow-black bg-background-sh">
            <RiLoaderFill className="size-6 animate-spin" />
          </div>
          <div className="h-[52px] animate-fade-in transition-all duration-300 relative col-span-1 flex justify-center items-center border rounded-md border-border shadow-lg shadow-black bg-background-sh">
            <RiLoaderFill className="size-6 animate-spin" />
          </div>
        </div>
      </div>
      <div className="hidden xs:block">
        <div className="w-full h-10" />
        <div className="flex flex-col gap-2 my-[4rem]">
          <div className="flex gap-2 items-center">
            <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
              <ChevronLeft size={16}/>
            </Button>
            <Button size="icon" variant="outline" className="focus-visible:ring-transparent rounded-full">
              <ChevronRight size={16}/>
            </Button>
          </div>
          <div className="flex items-start gap-2">
            <Text variant="h1">Scheduling</Text>
          </div>
        </div>
        <div className="h-11 mb-8 flex justify-start border-b border-border" />
        <div className="w-full flex justify-end items-center gap-2 mb-4">
          <Label className="text-xs text-muted-foreground">Recurring only</Label>
          <Switch checked={false} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-4 mb-16">
          {Array.from({length: 7}, (a, i) => { return i }).map((c) => (
            <div key={c} style={{ aspectRatio: "3/4" }} className="animate-fade-in transition-all duration-300 relative h-full col-span-1 flex justify-center items-center border rounded-md border-border shadow-lg shadow-black bg-background-sh">
              <RiLoaderFill className="size-6 animate-spin" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
