import { Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TableColumnsProps<TData> {
  table: Table<TData>;
}

export function Columns<TData>({ table }: TableColumnsProps<TData>) {
  return (
    <div className="absolute z-10 top-[84px] xs:top-[84px] right-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full bg-background-sh" aria-label="Set visibility of data table columns">
            <Plus size={20}/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[7rem] bg-background-sh shadow-black shadow-md">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize text-xs"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  aria-label={`Toggle visibility of ${column.id}`}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
