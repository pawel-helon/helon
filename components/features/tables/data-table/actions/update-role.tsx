"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ROLE } from "@prisma/client";
import { updateRole } from "@/actions/database-actions";

export function UpdateRole<TData>({
  table,
  ids,
}: {
  table: Table<TData>;
  ids: number[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleRoleChange(role: ROLE) {
    try {
      const updatingRole = await updateRole(role, ids);
      if (updatingRole.status !== 200) {
        toast.error(updatingRole.message);
        return;
      }
      setOpen(!open);
      table.resetRowSelection();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error has occurred");
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="min-w-[7.5rem] flex justify-between items-center gap-1 pr-1"
          aria-label="Change role"
        >
          Change role
          <ChevronDown size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-fit min-w-[7.5rem] flex flex-col bg-background-sh shadow-black shadow-md"
      >
        <Button
          variant="ghost"
          size="sm"
          className="justify-start pl-2"
          onClick={() => handleRoleChange(ROLE.ENDUSER)}
          aria-label="Change role to end user"
        >
          End user
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start pl-2"
          onClick={() => handleRoleChange(ROLE.OWNER)}
          aria-label="Change role to owner"
        >
          Owner
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start pl-2"
          onClick={() => handleRoleChange(ROLE.ADMIN)}
          aria-label="Change role to admin"
        >
          Admin
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}