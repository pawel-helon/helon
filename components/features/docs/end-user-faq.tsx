"use server"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Image from "next/image";

export async function EndUserFAQ() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-full h-min col-span-3 border border-border rounded-lg bg-background shadow-black shadow-2xl py-2 px-4">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-left">How to request access to the device?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Fill out request access form. You will need EMEI, that is placed on the device. You can also scan QR code.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-left">Device is inactive or disabled. What shall I do?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Go to device page and select <span className="text-foreground">&quot;Contact support&quot;</span> in the More Options dropdown:
          <Image src="/more-button.png" alt="more button" width={24} height={24} className="mt-2" />
        </AccordionContent>
      </AccordionItem>
    </Accordion> 
  )
}