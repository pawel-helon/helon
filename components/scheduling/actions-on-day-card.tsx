import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { deleteSlots, disableRecurringDay, setRecurringDay, undoDeleteSlots } from "@/actions/database-actions";
import { checkRecurringDay } from "@/actions/server-actions";
import { DuplicateDay } from "@/components/scheduling/duplicate-day";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Slot } from "@prisma/client";

export function ActionsOnDayCard(props: {
  day: string;
  slots: Slot[];
  weekDays: string[];
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
        return;
      }
      router.refresh();
      toast.success(settingRecurringDay.message, {
        action: {
          label: 'Undo',
          onClick: () => {
            async function initUndoSetRecurringDay() {
              const undoSettingRecurringDay = await disableRecurringDay(props.day, props.slots);
              if (undoSettingRecurringDay.status !== 204) {
                toast.error('Failed to undo set recurring day.');
                return;
              }
              router.refresh();
            }
            initUndoSetRecurringDay();
          }
        },
        duration: 3000
      });
      setDropdownOpened(!dropdownOpened);
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }

  async function handleDisableRecurringDay() {
    try {
      const disablingRecurringDay = await disableRecurringDay(props.day, props.slots);
      if (disablingRecurringDay.status !== 204) {
        toast.error(disablingRecurringDay.message);
        return;
      }
      router.refresh();
      toast.success(disablingRecurringDay.message, {
        action: {
          label: 'Undo',
          onClick: () => {
            async function initUndoDisableRecurringDay() {
              const undoDisablingRecurringDay = await setRecurringDay(props.day, props.slots);
              if (undoDisablingRecurringDay.status !== 201) {
                toast.error('Failed to undo disable recurring day.');
                return;
              }
              router.refresh();
            }
            initUndoDisableRecurringDay();
          }
        },
        duration: 3000
      });
      setDropdownOpened(!dropdownOpened)
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.')
    }
  }

  async function handleDeleteSlots() {
    try {
      const deletingSlots = await deleteSlots(props.day);
      if (deletingSlots.status !== 204) {
        setDropdownOpened(!dropdownOpened)
        toast.error(deletingSlots.message);
        return
      }
      toast.success('Slots have been deleted', {
        action: {
          label: 'Undo',
          onClick: () => {
            async function initUndoDeleteSlots() {
              const undoingDeleteSlots = await undoDeleteSlots(deletingSlots.prevSlots!);
              if (undoingDeleteSlots.status !== 201) {
                toast.error(undoingDeleteSlots.message);
                return;
              }
              router.refresh();
            }
            initUndoDeleteSlots();
          },
        },
        duration: 3000
      });
      setDropdownOpened(!dropdownOpened)
      router.refresh();
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.')
    }
  }
  
  return (
    <div className="flex">
      <DuplicateDay day={props.day} slots={props.slots} weekDays={props.weekDays} />
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
          <Button onClick={handleDeleteSlots} variant="ghost" size="sm" className="justify-start text-left pl-1.5">
            Delete slots
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
