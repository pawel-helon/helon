"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContentWithoutAnimationAndClose as DialogContent, DialogTitle as DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography";
import { useState } from "react";
import { addSlot, deleteSlot, getSlotsForWeek, updateSlotHour, updateSlotMinutes } from "@/actions/server-actions";
import { toast } from "sonner";
import { useMedia } from "react-use";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { CaretSortIcon } from "@radix-ui/react-icons"
import { Slot } from "@prisma/client";

type DaySlots = { day: string; slots: Slot[] };

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];
const DAYSOFWEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function Availability(props: {
  currentWeek: string[];
  currentWeekSlots: DaySlots[];
}) {
  const [displayedWeek, setDisplayedWeek] = useState(props.currentWeek);
  const [displayedWeekSlots, setDisplayedWeekSlots] = useState(props.currentWeekSlots);

  const isMobile = useMedia("(max-width: 480px)", false);

  async function handleNextWeek() {
    const nextWeek = Array.from({ length: 7 }, (_, i) => {
      const dateTime = new Date(new Date(displayedWeek[0]).setDate(new Date(displayedWeek[0]).getDate() + 7 + i));
      const date = `${dateTime.getFullYear()}-${String(dateTime.getMonth() + 1).padStart(2, '0')}-${String(dateTime.getDate()).padStart(2, '0')}`
      return date;
    })

    try {
      const gettingNextWeekSlots = await getSlotsForWeek(nextWeek);
      if (gettingNextWeekSlots.status !== 200) {
        toast.error('Failed to fetch next week slots');
        return;
      }
      setDisplayedWeek(nextWeek);
      setDisplayedWeekSlots(gettingNextWeekSlots.weekSlots as DaySlots[]);
    } catch {
      toast.error('Failed to fetch next week slots');
    }
  }

  async function handlePrevWeek() {
    const prevWeek = Array.from({ length: 7 }, (_, i) => {
      const dateTime = new Date(new Date(displayedWeek[0]).setDate(new Date(displayedWeek[0]).getDate() - 7 + i));
      const date = `${dateTime.getFullYear()}-${String(dateTime.getMonth() + 1).padStart(2, '0')}-${String(dateTime.getDate()).padStart(2, '0')}`
      return date;
    })

    try {
      const gettingPrevWeekSlots = await getSlotsForWeek(prevWeek);
      if (gettingPrevWeekSlots.status !== 200) {
        toast.error('Failed to fetch previous week slots');
        return;
      }
      setDisplayedWeek(prevWeek);
      setDisplayedWeekSlots(gettingPrevWeekSlots.weekSlots as DaySlots[]);
    } catch {
      toast.error('Failed to fetch previous week slots');
    }
  }

  async function handleAddSlot(day: string) {
    try {
      const addingSlot = await addSlot(day);
      if (addingSlot.status !== 201) {
        toast.error('Failed to add slot');
        return;
      } else {
        window.location.reload();
      }
    } catch {
      toast.error('Failed to add slot');
    }
  }

  async function handleDeleteSlot(slotId: string) {
    try {
      const deletingSlot = await deleteSlot(slotId);
      if (deletingSlot.status !== 202) {
        toast.error('Failed to delete slot');
        return;
      } else {
        window.location.reload();
      }
    } catch {
      toast.error('Failed to delete slot');
    }
  }

  async function handleSlotHourChange(slotId: string, dateTime: Date, hour: string) {
    try {
      const updatingSlot = await updateSlotHour(slotId, dateTime, hour);
      if (updatingSlot.status !== 200) {
        toast.error('Failed to update slot');
        return;
      } else {
        window.location.reload();
      }
    } catch {
      toast.error('Failed to update slot');
    }
  }

  async function handleSlotMinutesChange(slotId: string, dateTime: Date, minutes: string) {
    try {
      const updatingSlot = await updateSlotMinutes(slotId, dateTime, minutes);
      if (updatingSlot.status !== 200) {
        toast.error('Failed to update slot');
        return;
      } else {
        window.location.reload();
      }
    } catch {
      toast.error('Failed to update slot');
    }
  }

  // async function handleDuplicateSlots(dayToDuplicate: string, day: DaySlots) {
  //   try {
  //     const duplicatingSlots = await duplicateSlots(dayToDuplicate, day);
  //     if (duplicatingSlots.status !== 201) {
  //       toast.error('Failed to duplicate slots');
  //       return;
  //     } else {
  //       window.location.reload();
  //     }
  //   } catch {
  //     toast.error('Failed to duplicate slots');
  //   }
  // }
  
  return (
    <>
      {isMobile ? (
        <div />
      ) : (
        <Dialog open={true}>
          <DialogContent aria-describedby="" className="max-w-[880px]">
            <div className="w-full flex justify-between">
              <DialogTitle>Availability</DialogTitle>
              <div className="flex items-center">
                <Button onClick={handlePrevWeek} size="icon" variant="ghost" className="focus-visible:ring-transparent">
                  <ChevronLeft size={18}/>
                </Button>
                <Text variant="p-small-thin" className="w-[160px] text-center text-foreground">
                  {`${String(new Date(displayedWeekSlots[0].day).getDate()).padStart(2, '0')} - ${String(new Date(displayedWeekSlots[6].day).getDate()).padStart(2, '0')} ${new Date(displayedWeekSlots[6].day).toLocaleString('default', { month: 'long' })} ${new Date(displayedWeekSlots[6].day).getFullYear()}`}
                </Text>
                <Button onClick={handleNextWeek} size="icon" variant="ghost" className="focus-visible:ring-transparent">
                  <ChevronRight size={18}/>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-8">
              {displayedWeekSlots.map((day) => {
                const date = new Date(day.day);
                // const notToday = displayedWeek.filter(d => d !== day.day);
                return (
                  <div key={day.day} style={{ aspectRatio: "3/4" }}className="relative col-span-1 flex flex-col p-2 border border-border rounded-md">
                    <Text variant="p-base-thick" className={cn(new Date() < new Date(`${day.day}T23:59:59.999Z`) ? "text-foreground" : "text-muted-foreground")}>{DAYSOFWEEK[date.getDay()]}</Text>
                    <div className="flex flex-col gap-2 mt-4">
                      {day.slots.length > 0 ? (
                        <>
                          <ScrollArea className="w-full flex flex-col gap-2 h-[140px]">
                            {day.slots.map((slot) => {
                              return (
                                <div key={slot.id} className="flex gap-2 items-center">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="sm" className="w-16 min-w-[64px]">
                                        {String(slot.dateTime.getHours()).padStart(2, '0')}
                                        <CaretSortIcon className="size-4 ml-2 text-muted-foreground"/>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-16 min-w-[64px] flex flex-col bg-black shadow-black shadow-md">
                                      <ScrollArea className="w-full h-[140px]">
                                        {HOURS.map((hours) => {
                                          return (
                                            <Button onClick={() => handleSlotHourChange(slot.id, slot.dateTime, hours)} variant="ghost" size="sm" className="w-full h-7 justify-start pl-2" key={hours}>
                                              {hours}
                                            </Button>
                                          );
                                        })}
                                      </ScrollArea>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="sm" className="w-16 min-w-[64px]">
                                        {String(slot.dateTime.getMinutes()).padStart(2, '0')}
                                        <CaretSortIcon className="size-4 ml-2 text-muted-foreground"/>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-16 min-w-[64px] flex flex-col bg-black shadow-black shadow-md">
                                      <ScrollArea className="w-full h-[140px]">
                                        {MINUTES.map((minutes) => {
                                          return (
                                            <Button onClick={() => handleSlotMinutesChange(slot.id, slot.dateTime, minutes)} variant="ghost" size="sm" className="w-full h-7 justify-start pl-2" key={minutes}>
                                              {minutes}
                                            </Button>
                                          );
                                        })}
                                      </ScrollArea>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  <Button onClick={() => handleDeleteSlot(slot.id)} size="icon" variant="ghost">
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              );
                            })}
                          </ScrollArea>
                          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="w-[104px] min-w-[104px] pr-2">
                                  Duplicate
                                  <ChevronDown size={16} className="size-4 ml-2"/>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-[104px] min-w-[104px] flex flex-col bg-black shadow-black shadow-md">
                                {/* {notToday.map((dayToDuplicate) => {
                                  return (
                                    <Button onClick={() => handleDuplicateSlots(dayToDuplicate, day)} variant="ghost" size="sm" className="justify-start pl-2" key={dayToDuplicate}>
                                      {DAYSOFWEEK[new Date(dayToDuplicate).getDay()]}
                                    </Button>
                                  );
                                })} */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button onClick={() => handleAddSlot(day.day) } size="icon" variant="outline">
                              <Plus size={16} />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          {new Date() <= new Date(new Date(day.day).setHours(23, 59, 59, 999)) ? (
                            <div className="absolute top-0 bottom-0 flex flex-col p-2 justify-center items-center gap-2 mt-4">
                              <Text variant="p-small-thin" className="w-full text-center text-muted-foreground text-balance">There are no slots created yet</Text>
                              <Button onClick={() => handleAddSlot(day.day)} size="sm" variant="outline">
                                <Plus className="size-4 -ml-2 mr-2"/>
                                Add slot
                              </Button>
                            </div>
                          ) : (
                            <div className="absolute top-0 bottom-0 flex flex-col p-2 justify-center items-center gap-2 mt-4">
                              <Text variant="p-small-thin" className="w-full text-center text-muted-foreground text-balance">There are no slots available.</Text>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
