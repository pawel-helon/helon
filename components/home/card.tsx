"use client"

import Link from "next/link";
import Image from "next/image";
import { CheckIcon } from "lucide-react";
import { IoIosInformationCircle } from "react-icons/io";
import { useMedia } from "react-use";
import { Text } from "@/components/typography";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Card(props: {
  title: string,
  link: string,
  overview: string[],
  imageSrc: string,
  colSpan: string,
  rowSpan: string,
  aspectRatio?: string
}) {
  const isMobile = useMedia("(max-width: 480px)", false);
  const cardAspectRatio = isMobile ? "1" : props.aspectRatio || "";

  return (
    <div
      style={{ aspectRatio: cardAspectRatio }}
      className={cn("relative flex flex-col justify-between border border-border rounded-md", props.colSpan, props.rowSpan)}
      role="article"
      aria-labelledby={`card-title-${props.title.toLowerCase().replace(/\s+g/, '-')}`}
    >
      <div className="z-20 w-full flex justify-between p-3 bg-gradient-to-b from-background-sh to-background-sh/40">
        <Text variant="h4" id={`card-title-${props.title.toLowerCase().replace(/\s+g/, '-')}`}>{props.title}</Text>        
        <Overview overview={props.overview} title={props.title}/>
      </div>
      <Image
        src={props.imageSrc}
        alt={`Illustration for ${props.title}`}
        priority
        width={0}
        height={0}
        sizes="100"
        style={{ width: "100%", height: "100%" }}
        className="absolute top-0 bottom-0 left-0 right-0"
      />
      <div className="z-20 w-full flex justify-end p-3 bg-gradient-to-t from-background-sh to-background-sh/40">
        <Link href={props.link} aria-label={`View demo for ${props.title}`}>
          <Button variant="outline" className="w-full xs:w-fit">
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
        <ul className="list-none p-0 m-0">
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