"use server"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Image from "next/image";

export async function OwnerFAQ() {
  return (
    <Accordion type="single" defaultValue="item-1" collapsible className="w-full h-min col-span-3 border border-border rounded-lg bg-background shadow-black shadow-2xl py-2 px-4">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-left">How to request ownership of the device?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Fill out request ownership form. You will need EMEI, that is placed on the device. You can also scan QR code.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-left">How to give access to the device?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Go to device page and select <span className="text-foreground">&quot;Give access&quot;</span> in the More Options dropdown:
          <Image src="/more-button.png" alt="more button" width={24} height={24} className="mt-2" />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-left">Device is inactive or disabled. What shall I do?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Also, in the &quot;More Options&quot; dropdown menu, you can choose to disable and activate or deactivate device.
        </AccordionContent>
      </AccordionItem>
    </Accordion> 
  )
}