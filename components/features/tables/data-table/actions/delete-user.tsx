"use client";

import { Table } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteTanstack } from "@/lib/data/delete";

import { Text } from "@/components/ui-q/typography";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteUser<TData>({
  table,
  ids,
  openDropdown,
  setOpenDropdown,
}: {
  table: Table<TData>;
  ids: number[];
  openDropdown: boolean;
  setOpenDropdown: (openDropdown: boolean) => void;
}) {
  const router = useRouter();

  return (
    <>
      <div className="xs:hidden">
        <Sheet onOpenChange={setOpenDropdown}>
          <SheetTrigger asChild>
            <button className="w-20 cursor-default hover:bg-accent relative flex select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              Delete
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" aria-describedby="">
            <div className="flex flex-col p-3 space-y-1.5 text-left border-b border-border">
              <Text variant="h3" className="text-center">Delete user</Text>
            </div>
            <div className="pl-3 pr-2 pt-6 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1">
              <div className="min-h-16">
                <Text variant="p-base-thin" className="text-center">Are you sure you want to delete selected user(s)? This action cannot be undone.</Text>
              </div>
              <div className="flex flex-col justify-end py-3 gap-2 bg-background">
                <SheetClose asChild>
                  <Button variant="ghost" onClick={() => setOpenDropdown(!openDropdown)}>Cancel</Button>
                </SheetClose>
                <Button onClick={() => deleteTanstack(ids, "user").then(() => {
                  setTimeout(() => {
                    setOpenDropdown(!openDropdown);
                    toast.success("Selected user(s) have been deleted.");
                    table.resetRowSelection();
                    router.refresh();
                  }, 300);
                })}>
                  Delete user
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden xs:block">
        <Dialog onOpenChange={setOpenDropdown}>
          <DialogTrigger asChild>
              <button className="w-full cursor-default hover:bg-accent relative flex select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                Delete
              </button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col p-6 space-y-1.5 text-left border-b border-border">
              <Text variant="h3">Delete user</Text>
            </div>
            <div className="pl-6 pr-5 pt-6 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background min-h-[200px] max-h-[70vh] scrollbar-w-1">
              <Text variant="p-base-thin">Are you sure you want to delete selected user(s)?</Text>
              <div className="absolute xs:fixed bottom-0 left-0 right-0 flex justify-end px-6 py-3 gap-2 border-t border-border bg-background">
                <DialogClose asChild>
                  <Button variant="ghost" onClick={() => setOpenDropdown(!openDropdown)}>Cancel</Button>
                </DialogClose>
                <Button onClick={() => deleteTanstack(ids, "user").then(() => {
                  setTimeout(() => {
                    setOpenDropdown(!openDropdown);
                    toast.success("Selected user(s) have been deleted.");
                    table.resetRowSelection();
                    router.refresh();
                    }, 300);
                })}>
                  Delete user
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
