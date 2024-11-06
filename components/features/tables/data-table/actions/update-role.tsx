"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROLE } from "@prisma/client";
import { updateRole } from "@/actions/database-actions";
import { useMedia } from "react-use";

export function UpdateRole<TData>({
  table,
  ids,
}: {
  table: Table<TData>;
  ids: number[];
}) {
  const isMobile = useMedia("(max-width: 480px)", false);
  const [visibility, setVisibilty] = useState(false);
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
          variant={isMobile ? "outline" : "ghost"}
          onMouseEnter={() => setVisibilty(true)}
          onMouseLeave={() => setVisibilty(false)}
          className={cn(isMobile ? "w-[6rem] h-9" : "flex justify-between items-center gap-1 pr-1")}
          aria-label="Change role"
        >
          Change role
          {!isMobile && <ChevronDown size={20} className={cn(visibility ? "opacity-100" : "opacity-0")} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isMobile ? "end" : "start"}
        className="w-fit min-w-[6rem] xs:min-w-[7rem] flex flex-col bg-background-sh shadow-black shadow-md"
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