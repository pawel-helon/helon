"use client"

import { useMedia } from "react-use";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/features/tables/data-table";
import { ActionsTables } from "@/components/features/tables/actions-tables";
import { Dialog, DialogContentWithoutCloseNoPadding as DialogContent, DialogTitleH as DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContentWithoutClose as SheetContent, SheetTitleH as SheetTitle} from "@/components/ui/sheet";

interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function Table<TData, TValue>({ data, columns }: TableProps<TData, TValue>) {
  const isMobile = useMedia("(max-width: 480px)", false);

  return (
    <>
      {isMobile ? (
        <Sheet open={true}>
          <SheetContent side="bottomNoPadding" aria-describedby="">
            <ActionsTables />
            <div className="p-3">
              <SheetTitle className="text-center mb-8">Users</SheetTitle>
              <DataTable data={data} columns={columns} />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={true}>
          <DialogContent className="h-[560px] flex flex-col justify-start" aria-describedby="">
            <ActionsTables />
            <div className="p-6">
              <DialogTitle className="mb-8">Users</DialogTitle>
              <DataTable data={data} columns={columns} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}