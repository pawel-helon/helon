"use client";

import { useEffect } from "react";
import { useMedia } from "react-use";
import { MdError } from "react-icons/md";

import { Text } from "@/components/typography";
import { Sheet, SheetContentWithoutClose as SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContentWithoutClose as DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ErrorHomePage({ error }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const router = useRouter();
  const isMobile = useMedia("(max-width: 480px)", false);

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
                <Text variant="p-base-thin" className="h-16 text-center">Something went wrong.</Text>
              <div className="flex flex-col justify-end gap-2 border-t border-border bg-background">
                <Button onClick={() => router.refresh()}>Try again</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true}>
          <DialogContent aria-describedby="">
            <div className="flex justify-between items-start mb-8 text-left">
              <Text variant="h3">Error</Text>
              <MdError className="text-muted-foreground size-5"/>
            </div>
            <div className="min-h-[200px]">
              <Text variant="p-base-thin">Something went wrong.</Text>
              <div className="absolute xs:fixed bottom-0 left-0 right-0 flex justify-end px-6 py-3 gap-2 border-t border-border bg-background">
                <Button onClick={() => router.refresh()}>Try again</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
