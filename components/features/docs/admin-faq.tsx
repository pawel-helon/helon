import Image from "next/image";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export function AdminFAQ() {
  return (
    <Accordion type="single" defaultValue="item-1" collapsible className="w-full h-min col-span-3 border border-border rounded-lg bg-background shadow-black shadow-2xl py-2 px-4">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-left">How to add new device?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Fill out add device form. You will need EMEI, SIM, and model, that are placed on the device. You can also add device by scanning QR code.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-left">How to assign new owner of the device?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Go to device page and select <span className="text-foreground">&quot;Assign new owner&quot;</span> in the More Options dropdown:
          <Image src="/more-button.png" alt="more button" width={24} height={24} className="mt-2" />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-left">Device is inactive or disabled. What shall I do?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Also, in the &quot;More Options&quot; dropdown menu, you can choose to activate or deactivate the device. If the device is disabled, please reach out to the device owner for assistance.
        </AccordionContent>
      </AccordionItem>
    </Accordion> 
  )
}