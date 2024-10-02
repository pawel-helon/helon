import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Slot } from "@prisma/client";
import { DuplicateDaySlots } from "@/components/scheduling/duplicate-day-slots";
import { DeleteDaySlots } from "@/components/scheduling/delete-day-slots";
import { checkRecurringDay, disableRecurringDay, setRecurringDay } from "@/actions/server-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ActionsOnDayCard(props: {
  day: string;
  slots: Slot[];
  daysExceptToday: string[];
}) {
  const [dropdownOpened, setDropdownOpened] = useState<boolean>(false);
  const [recurringDate, setRecurringDate] = useState<boolean>(false);
  const router = useRouter();
  
  useEffect(() => {
    async function checkingRecurringDay() {
      try {
        const checkingRecurringDay = await checkRecurringDay(props.day);
        if ( checkingRecurringDay.status === 200) {
          setRecurringDate(true);
        }
      } catch (error) {
        toast.error('An unexpected error occurred. Try again later.')
      }
    }
    checkingRecurringDay();
  },[props.day, setRecurringDate])

  async function handleSetRecurringDay() {
    try {
      const settingRecurringDay = await setRecurringDay(props.day, props.slots);
      if (settingRecurringDay.status !== 201) {
        toast.error(settingRecurringDay.message);
      } else {
        toast.success(settingRecurringDay.message);
        router.refresh();
      }
      setDropdownOpened(!dropdownOpened);
      setRecurringDate(!recurringDate);
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }

  async function handleDisableRecurringDay() {
    try {
      const disablingRecurringDay = await disableRecurringDay(props.day, props.slots);
      if (disablingRecurringDay.status !== 204) {
        toast.error(disablingRecurringDay.message);
      } else {
        toast.success(disablingRecurringDay.message);
      }
      setDropdownOpened(!dropdownOpened)
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.')
    }
  }

  
  return (
    <div className="flex">
      <DuplicateDaySlots day={props.day} slots={props.slots} daysExceptToday={props.daysExceptToday}/>
      <DropdownMenu open={dropdownOpened} onOpenChange={setDropdownOpened}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-8 rounded-l-none px-1.5">
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[132px] flex flex-col bg-black shadow-black shadow-md p-1">
          <Button onClick={recurringDate ? handleDisableRecurringDay : handleSetRecurringDay} variant="ghost" size="sm" className="justify-start text-left pl-1.5">
            {recurringDate ? 'Disable recurring' : 'Set recurring'}
          </Button>
          <DeleteDaySlots day={props.day} dropdownOpened={dropdownOpened} setDropdownOpened={setDropdownOpened}/>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
