"use client"

import { useEffect } from "react"
import { toast } from "sonner";
import { navigateUser } from "@/actions/actions-from-qr-code";

export default function QRCodeActions() {
  useEffect(() => {
    try {
      const initActions = async () => {
        try {
          await navigateUser();
        } catch (error) {
          console.error(error);
          toast.error("An unexpected error occurred. Try again later.");
        }
      }
      initActions();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Try again later.");
    }
  },[])
  
  return null;
}