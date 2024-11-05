"use client";

import { useState } from "react";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Actions } from "@/components/features/tables/data-table/actions";
import { TableBody, TableCell, TableHead, TableHeader, Table, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  frequentUsers?: { userId: number; userName: string; count: number }[];
  deviceId?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const pageSize = pagination.pageSize;

  return (
    <div className="flex flex-col">
      <div className="relative flex justify-end mb-8 py-1 border-b border-border">
        <Search className="size-5 absolute -z-10 left-0 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name"
          spellCheck={false}
          value={table.getColumn("name")?.getFilterValue() as string}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="w-full indent-4 border-none focus-visible:ring-0 focus-visible:bg-transparent"
        />
        <Actions table={table} />
      </div>
      <div className="h-[340px] flex flex-col gap-4 overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
        <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-t h-12">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex justify-between items-center py-3">
        <span className="hidden whitespace-nowrap xs:flex text-xs text-muted-foreground">
          {`${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected.`}
        </span>
        <div className="w-full flex justify-between xs:justify-end xs:gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-2 text-muted-foreground text-xs focus-visible:ring-0">
                {pageSize} rows
                <ChevronDown className="ml-2 -mr-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="min-w-[5rem] bg-background-sh shadow-black shadow-md">
              <DropdownMenuItem onSelect={() => setPagination({pageIndex: 0, pageSize: 5})}>
                5
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setPagination({pageIndex: 0, pageSize: 10})}>
                10
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setPagination({pageIndex: 0, pageSize: 20})}>
                20
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="space-x-2">
            <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} variant="outline" size="icon" className="bg-background-sh">
              <ChevronLeft />
            </Button>
            <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} variant="outline" size="icon" className="bg-background-sh">
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
