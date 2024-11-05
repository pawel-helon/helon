"use client";

import { Table } from "@tanstack/react-table";
import { Columns } from "./columns";
import { UpdateRole } from "./update-role";

export function Actions<TData>({ table }: { table: Table<TData> }) {
  const selectedRowsActions = table.getSelectedRowModel().rows;
  // @ts-expect-error - issue with tanstack/react-table types
  const ids = selectedRowsActions.map((row) => row.original.id) as number[];

  return (
    <div className="relative h-8 flex gap-1">
      {table.getFilteredSelectedRowModel().rows.length > 0 && <UpdateRole table={table} ids={ids} />}
      <Columns table={table} />
    </div>
  );
}
