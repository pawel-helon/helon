"use client";

import React, { useEffect  } from "react";
import { toast } from "sonner";
import { useMedia } from "react-use";
import { unblockSlots, deletePastSlots } from "@/actions/database-actions";
import { ChooseSlotFormDesktop } from "@/components/book-meeting/choose-slot-form-desktop";
import { ChooseSlotFormMobile } from "@/components/book-meeting/choose-slot-form-mobile";

export default function ChooseSlotPage() {
  const isMobile = useMedia("(max-width: 480px)", false);

  useEffect(() => {
    async function initSlots() {
      try {
        await deletePastSlots();
        await unblockSlots();
      } catch {
        toast.error("Error initializing slots.")
      }
    }
    initSlots();
  },[])
  
  return <>{isMobile ? <ChooseSlotFormMobile /> : <ChooseSlotFormDesktop />}</>;
}
