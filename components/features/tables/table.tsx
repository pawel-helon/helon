"use client"

import { useMedia } from "react-use";
import { Toast } from "@/components/features/tables/toast";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/features/tables/data-table";
import { Dialog, DialogContentWithoutClose as DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContentWithoutClose as SheetContent, SheetTitleH as SheetTitle} from "@/components/ui/sheet";

interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function Table<TData, TValue>({
  data,
  columns,
}: TableProps<TData, TValue>) {
  const isMobile = useMedia("(max-width: 480px)", false);

  return (
    <>
      {isMobile ? (
        <Sheet open={true}>
          <SheetContent side="bottomNoPadding" aria-describedby="">
            <div className="p-6">
              <SheetTitle>Users</SheetTitle>
              <DataTable data={data} columns={columns} />
            </div>
            <Toast />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true}>
          <DialogContent aria-describedby="" className="h-[560px] flex flex-col justify-start">
            <DialogTitle className="mb-8">Users</DialogTitle>
            <DataTable data={data} columns={columns} />
            <Toast />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}