"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { MdError } from "react-icons/md";

import { Text } from "@/components/typography";
import { Sheet, SheetContentWithoutClose as SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContentWithoutClose as DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ErrorAccountPage({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isMobile = useMedia("(max-width: 480px)", false);
  const router = useRouter();

  return (
    <>
      {isMobile ? (
        <Sheet open={true}>
          <SheetContent side="bottom" aria-describedby="">
            <div className="relative p-3 text-left border-b border-border">
              <Text variant="h3" className="text-center">Error</Text>
              <MdError className="absolute top-3 right-3 text-muted-foreground size-5"/>
            </div>
            <div className="py-6 px-3">
                <Text variant="p-base-thin" className="h-16 text-center">Something went wrong. Try again or go to devices.</Text>
              <div className="flex flex-col justify-end gap-2 border-t border-border bg-background">
                <Button variant="ghost" onClick={() => router.push('/devices')}>Back</Button>
                <Button onClick={() => reset()}>Try again</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true}>
          <DialogContent aria-describedby="">
            <div className="flex justify-between items-start p-6 text-left border-b border-border">
              <Text variant="h3">Error</Text>
              <MdError className="text-muted-foreground size-5"/>
            </div>
            <div className="pl-6 pr-5 pt-6 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background min-h-[200px] max-h-[70vh] scrollbar-w-1">
              <Text variant="p-base-thin">Something went wrong. Try again or go to devices.</Text>
              <div className="absolute xs:fixed bottom-0 left-0 right-0 flex justify-end px-6 py-3 gap-2 border-t border-border bg-background">
                <Button variant="ghost" onClick={() => router.push('/devices')}>Back</Button>
                <Button onClick={() => reset()}>Try again</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
