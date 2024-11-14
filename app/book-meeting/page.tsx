"use client";

import React, { Suspense, useEffect  } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useMedia } from "react-use";
import { deletePastSlotsHelon, unblockSlotsHelon } from "@/actions/database-actions";
import { ChooseSlotFormDesktop } from "@/components/book-meeting/choose-slot-form-desktop";
import { ChooseSlotFormMobile } from "@/components/book-meeting/choose-slot-form-mobile";

export default function ChooseSlotPage() {
  const isMobile = useMedia("(max-width: 480px)", false);
  const searchParams = useSearchParams();
  const isChangingSlot = Boolean(searchParams.get("param"));

  useEffect(() => {
    async function initSlots() {
      try {
        await deletePastSlotsHelon();
        await unblockSlotsHelon();
      } catch {
        toast.error("Error initializing slots.")
      }
    }
    initSlots();
  },[])
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isMobile ? <ChooseSlotFormMobile isChangingSlot={isChangingSlot} /> : <ChooseSlotFormDesktop isChangingSlot={isChangingSlot} />}
    </Suspense>
  )
}
