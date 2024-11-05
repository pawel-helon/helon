"use client";

import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";

import { DeleteDevice } from "./delete-device";
import { DeleteUser } from "./delete-user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function More<TData>({
  table,
  ids,
  pathname,
}: {
  table: Table<TData>;
  ids: any[];
  pathname: string;
}) {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="px-[3px]">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="bg-background shadow-black shadow-md">
        {pathname === "/devices" && <DeleteDevice table={table} ids={ids} setOpenDropdown={setOpenDropdown} openDropdown={openDropdown} />}
        {pathname === "/users" && <DeleteUser table={table} ids={ids} setOpenDropdown={setOpenDropdown} openDropdown={openDropdown} />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
