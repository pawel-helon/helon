"use client";

import { useState } from "react";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Actions } from "@/components/features/tables/data-table/actions";
import { TableBody, TableCell, TableHead, TableHeader, Table, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMedia } from "react-use";

const PAGE_SIZES = [5,10,20]

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
  const isMobile = useMedia("(max-width: 480px)", false);
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
    <div className="w-full flex flex-col">
      <div className="relative flex justify-end mb-8 py-1 border-b border-border">
        <Search className="size-4 absolute -z-10 left-0 top-1/2 transform -translate-y-1/2 text-foreground-h" />
        <Input
          placeholder="Search by name"
          spellCheck={false}
          value={table.getColumn("name")?.getFilterValue() as string}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="w-full text-xs placeholder:text-foreground indent-4 border-none focus-visible:ring-0 focus-visible:bg-transparent"
          aria-label="Search by name"
        />
        <Actions table={table} />
      </div>
      <div className="pt-2 border broder-border rounded-md shadow-black shadow-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} aria-label={`Sort data by ${header.id}`}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-xs">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center p-3">
          <span className="hidden whitespace-nowrap xs:flex text-xs text-muted-foreground">
            {`${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected.`}
          </span>
          <div className="w-full flex justify-between xs:justify-end xs:gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={isMobile ? "outline" : "ghost"} className="min-w-[6rem] px-2 text-muted-foreground text-xs focus-visible:ring-0" aria-label="Set number of displayed rows">
                  {pageSize} rows
                  <ChevronDown className="ml-2 -mr-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="min-w-[6rem] bg-background-sh shadow-black shadow-md">
                {PAGE_SIZES.filter((entry) => entry !== pageSize).map((pageSize) => (
                  <DropdownMenuItem key={pageSize} onSelect={() => setPagination({pageIndex: 0, pageSize: pageSize})} aria-label={`Set number of displayed rows to ${pageSize}`}>
                    {pageSize}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="space-x-2">
              <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} variant="outline" size="icon" className="bg-background-sh" aria-label="Go to previous page">
                <ChevronLeft />
              </Button>
              <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} variant="outline" size="icon" className="bg-background-sh" aria-label="Go to next page">
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
