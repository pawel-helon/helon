"use client"

import { DisabledAction } from "@/components/disabled-action";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { useMedia } from "react-use";

export function Statistics() {
  const isMobile = useMedia("(max-width: 480px)", false);
  return (
    <DisabledAction side={isMobile ? "bottom" : "right"} sideOffset={12}>
      <Button variant="outline" className="h-min p-1 rounded-full" aria-label="Open statistics page">
        <TrendingUp size={18} />
      </Button>
    </DisabledAction>
  )
}