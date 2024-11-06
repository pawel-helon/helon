"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { $Enums } from "@prisma/client";

export type User = {
  id: number;
  name: string | null;
  email: string;
  role: $Enums.ROLE;
  devices?: string | null;
};

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value)
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-[100px] justify-start text-xs hover:bg-transparent p-0"
        >
          Name
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs hover:bg-transparent p-0"
        >
          Email
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs hover:bg-transparent p-0"
        >
          Role
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue() as "ADMIN" | "OWNER" | "ENDUSER";
      return (
        <Badge className="w-20" variant={value === "ADMIN" ? "admin" : value === "OWNER" ? "owner" : "endUser"}>
          {value === "ENDUSER" ? "end user" : value.toLowerCase()}
        </Badge>
      );
    },
  },
];