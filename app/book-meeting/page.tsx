"use client";

import React, { useEffect  } from "react";
import { toast } from "sonner";
import { useMedia } from "react-use";
import { unblockSlots, deletePastSlots } from "@/actions/database-actions";
import { ChooseSlotFormDesktop } from "@/components/book-meeting/choose-slot-form-desktop";
import { ChooseSlotFormMobile } from "@/components/book-meeting/choose-slot-form-mobile";
import { useSearchParams } from "next/navigation";

export default function ChooseSlotPage() {
  const isMobile = useMedia("(max-width: 480px)", false);
  const searchParams = useSearchParams();
  const isChangingSlot = Boolean(searchParams.get("param"));

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
  
  return <>{isMobile ? <ChooseSlotFormMobile isChangingSlot={isChangingSlot} /> : <ChooseSlotFormDesktop isChangingSlot={isChangingSlot} />}</>;
}
