"use client"

import { useEffect } from "react"
import { navigateUser } from "@/actions/actions-from-qr-code";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function QRCodeActions() {
  const router = useRouter();
  useEffect(() => {
    try {
      const init = async () => {
        await navigateUser(router);
      }
      init();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Try again later")
    } 
  },[router])
  
  return null;
}