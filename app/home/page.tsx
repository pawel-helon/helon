import Link from "next/link";
import { IoIosInformationCircle } from "react-icons/io";
import { Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import { CheckIcon } from "lucide-react";

export default async function HomePage() {
  return (
    <div className="mb-16">
      <div className="relative h-[80vh] justify-center items-center flex flex-col gap-8">
        <Text variant="h1" className="text-5xl xs:text-6xl">Web apps</Text>
        <Text variant="p-base-thin">
          Fully responsive web apps built with{" "}
          <span className="text-white">Next.js</span>
        </Text>
        <Link href="/book-meeting" prefetch={true}>
          <Button size="lg">Book meeting</Button>
        </Link>
        <span className="absolute top-[5%] right-[10%] animate-scale-160 rounded-full size-1.5 bg-accent-pink-h" />
        <span className="absolute top-[57%] xs:top-[40%] left-[5%] xs:left-[20%] animate-scale-140 rounded-full size-3 bg-accent-orange-h" />
        <span className="absolute bottom-[10%] right-[30%] animate-scale rounded-full size-5 bg-accent-yellow-h" />
      </div>
      <div className="grid grid-cols-3 grid-rows-4 gap-4">
        <div className="col-span-1 row-span-2 border border-border rounded-md shadow-black shadow-lg">
          1
        </div>
        <div style={{ aspectRatio: "1" }} className="col-span-1 row-span-1 border border-border rounded-md shadow-black shadow-lg">
          2
        </div>
        <div style={{ aspectRatio: "1" }} className="col-span-1 row-span-1 border border-border rounded-md shadow-black shadow-lg">
          3
        </div>
        <div style={{ aspectRatio: "1" }} className="relative flex flex-col justify-between p-3 col-span-1 row-span-1 border border-border rounded-md shadow-black shadow-lg">
          <div className="z-10 flex justify-between items-start">
            <Text variant="h4">Scheduling</Text>
            <Popover>
              <PopoverTrigger>
                <IoIosInformationCircle size={18} className="text-muted-foreground animation transition-colors duration-200 hover:text-foreground-h/80"/>
              </PopoverTrigger>
              <PopoverContent side="bottom" sideOffset={8} align="end" className="w-fit flex flex-col gap-4 pb-8 bg-background-sh">
                <Text variant="p-base-thick">Features</Text>
                <div className="flex items-center gap-2">
                  <div className='size-4 relative rounded-full text-background-sh shadow-md bg-green-600'><CheckIcon className='size-3.5 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-background-sh' /></div>
                  <Text variant="p-small-thin">quickly setup your availability</Text>
                </div>
                <div className="flex gap-2">
                  <div className='size-4 relative rounded-full text-background-sh shadow-md bg-green-600'>
                    <CheckIcon className='size-3.5 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-background-sh' />
                  </div>
                  <Text variant="p-small-thin">easily manage appointments</Text>
                </div>
                <div className="flex gap-2">
                  <div className='size-4 relative rounded-full text-background-sh shadow-md bg-green-600'>
                    <CheckIcon className='size-3.5 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-background-sh' />
                  </div>
                  <Text variant="p-small-thin">get confirmations to your inbox</Text>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="z-10 w-full flex justify-end">
            <Link href="/features/scheduling">
              <Button variant="outline">
                Demo
              </Button>
            </Link>
          </div>
          <Image src="/scheduling.png" alt="avatr" width={0} height={0} sizes="100" style={{ width: "100%", height: "100%" }} className="absolute top-0 bottom-0 left-0 right-0"/>
        </div>
        <div className="col-span-1 row-span-2 border border-border rounded-md shadow-black shadow-lg">
          5
        </div>
        <div style={{ aspectRatio: "1" }} className="col-span-1 row-span-1 border border-border rounded-md shadow-black shadow-lg">
          6
        </div>
        <div style={{ aspectRatio: "1" }} className="col-span-1 row-span-1 border border-border rounded-md shadow-black shadow-lg">
          7
        </div>
        <div className="col-span-2 row-span-1 border border-border rounded-md shadow-black shadow-lg">
          8
        </div>
        <div style={{ aspectRatio: "1" }} className="col-span-1 row-span-1 border border-border rounded-md shadow-black shadow-lg">
          9
        </div>
      </div>
    </div>
  );
}
