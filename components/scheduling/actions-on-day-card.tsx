import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { duplicateSlots } from "@/actions/server-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Slot } from "@prisma/client";

export function ActionsOnDayCard(props: {
  daysExceptToday: string[];
}) {
  // const [actionsOnDayCardDropdownOpened, setActionsOnDayCardDropdownOpened] = useState<boolean>(false);
  
  return (
    <div className="flex">
      <DuplicateFor daysExceptToday={props.daysExceptToday}/>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-8 rounded-l-none px-1.5">
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[136px] flex flex-col bg-black shadow-black shadow-md p-1">
          <SetRecurring />
          <DeleteSlots />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function DuplicateFor(props: {
  daysExceptToday: string[];
}) {
  const router = useRouter();
  async function handleDuplicateSlots(dayToDuplicate: string, slots: Slot[]) {
    try {
      const duplicatingSlots = await duplicateSlots(dayToDuplicate, slots);
      if (duplicatingSlots.status !== 201) {
        toast.error('Failed to duplicate slots');
        return;
      } else {
        router.refresh();
      }
    } catch {
      toast.error('Failed to duplicate slots');
    }
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-26 rounded-r-none">
          Duplicate for
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background-h">
        Select day for duplicating slots form
        {props.daysExceptToday}
        <Button onClick={() => handleDuplicateSlots()}>Duplicate</Button>
      </DialogContent>
    </Dialog>
  )
}

function SetRecurring() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="justify-start text-left pl-2.5">
          Set recurring
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background-h">
        Are you sure...set recurring
      </DialogContent>
    </Dialog>
  )
}

function DeleteSlots() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="justify-start text-left pl-2.5">
          Delete slots
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background-h">
        Are you sure... delete slots
      </DialogContent>
    </Dialog>
  )
}