"use client"

import Link from "next/link";
import Image from "next/image";
import { CheckIcon } from "lucide-react";
import { IoIosInformationCircle } from "react-icons/io";
import { Text } from "@/components/typography";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "@/components/ui/button";
import { useMedia } from "react-use";

export function Card(props: {
  title: string,
  link: string,
  overview: string[],
  mobileImageSrc: string,
  desktopImageSrc: string,
}) {
  const isMobile = useMedia("(max-width: 480px)", false);
  return (
    <div
      style={{ aspectRatio: isMobile ? "1" : "3/4" }}
      className="overflow-hidden relative flex flex-col justify-between rounded-md bg-background-sh shadow-md shadow-black border border-[#262629]"
      role="article"
      aria-labelledby={`card-title-${props.title.toLowerCase().replace(/\s+g/, '-')}`}
    >
      <div className="z-20 w-full flex justify-between p-3 bg-gradient-to-b from-background-sh to-background-sh/40">
        <Text variant="h4" id={`card-title-${props.title.toLowerCase().replace(/\s+g/, '-')}`}>{props.title}</Text>        
        <Overview overview={props.overview} title={props.title}/>
      </div>
      <Image
        src={isMobile ? props.mobileImageSrc : props.desktopImageSrc}
        alt={`Illustration for ${props.title}`}
        priority
        width={0}
        height={0}
        sizes="100"
        style={{ width: "100%", height: "100%" }}
        className="absolute top-0 bottom-0 left-0 right-0"
      />
      <div className="z-20 w-full flex justify-end p-3 bg-gradient-to-t from-background-sh to-background-sh/40">
        <Link href={props.link} aria-label={`View demo for ${props.title}`} className="w-full xs:w-fit">
          <Button variant="outline" className="w-full xs:w-fit bg-background-sh xs:hover:bg-[#252322]">
            Demo
          </Button>
        </Link>
      </div>
    </div>
  )
}

function Overview(props: {
  overview: string[];
  title: string
}) {
  return (
    <Popover>
      <PopoverTrigger aria-label={`View overview for ${props.title}`}>
        <IoIosInformationCircle size={18} className="text-muted-foreground animation transition-colors duration-200 hover:text-foreground-h/80"/>
      </PopoverTrigger>
      <PopoverContent side="bottom" sideOffset={8} align="end" className="w-fit flex flex-col gap-4 pb-8 bg-background-sh">
        <Text variant="p-base-thick">Overview</Text>
        <ul className="list-none space-y-3.5 p-0 m-0">
          {props.overview.map((entry, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className='size-4 relative rounded-full text-background-sh shadow-md bg-green-600'>
                <CheckIcon className='size-3.5 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-background-sh' />
              </div>
              <Text variant="p-small-thin" className="max-w-[30ch] text-balance">{entry}</Text>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}