"use client";

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

export function ProgressBar() {
  const [parentId, setParentId] = useState<string>('');
  const [widthChooseSlotPage, setWidthChooseSlotPage] = useState("w-0");
  const [widthConfirmBookingPage, setWidthConfirmBookingPage] = useState("w-1/3");
  
  useEffect(() => {
    const parentElement = document.getElementById("choose-slot-form") || document.getElementById("confirm-booking-form");
    if (parentElement) { setParentId(parentElement.id) }

    function handleProgressBarWidth() {
      if (parentId === "choose-slot-form") {
        setWidthChooseSlotPage("w-1/3");
      } else if (parentId === "confirm-booking-form") {
        setWidthConfirmBookingPage("w-2/3");
      }
    };
    handleProgressBarWidth();
  }, [parentId]);

  return (
    <div className={cn(
      "h-1 absolute top-0 left-0 transition-all duration-300 ease-in-out rounded-r-full xs:rounded-full xs:rounded-bl-none bg-primary",
      parentId === "choose-slot-form" ? widthChooseSlotPage : "",
      parentId === "confirm-booking-form" ? widthConfirmBookingPage : "",
    )}/>
  );
}