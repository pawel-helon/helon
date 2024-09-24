"use client";

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContentWithoutClose as DialogContent, DialogTitle as DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Slot } from "@prisma/client";
import { Text } from "@/components/typography";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = ["00", "15", "30", "45"];
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


export function Slots(props: { currentWeekSlots: { day: string; slots: Slot[] }[] }) {
  return (
    <Dialog open={true}>
      <DialogContent aria-describedby="" className="max-w-[880px]">
        <div className="w-full flex justify-between">
          <DialogTitle>Slots</DialogTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-[220px] flex justify-between items-center gap-1 pr-1 hover:bg-transparent focus-visible:ring-transparent">
                23-29 September 2024
                <ChevronDown size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[220px] flex flex-col bg-black shadow-black shadow-md">
                <Button variant="ghost" size="sm" className="w-full justify-start pl-2">
                  30 September - 06 October 2024
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start pl-2">
                  07-13 October 2024
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start pl-2">
                  14-20 October 2024
                </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-8">
          {props.currentWeekSlots.map((day) => {
            const date = new Date(day.day);
            return (
              <div key={day.day} style={{ aspectRatio: "3/4" }}className="relative col-span-1 flex flex-col p-2 border border-border rounded-md">
                <Text variant="p-base-thick">{daysOfWeek[date.getDay()]}</Text>
                <div className="flex flex-col gap-2 mt-4">
                  {day.slots.length > 0 ? (
                    <>
                      {day.slots.map((slot) => {
                        return (
                          <div key={slot.id} className="flex gap-2 items-center">
                            <Select name="hour">
                              <SelectTrigger className="w-16 min-w-[64px]">
                                <SelectValue placeholder={String(slot.dateTime.getHours()).padStart(2, '0')} />
                              </SelectTrigger>
                              <SelectContent className="w-16 min-w-[64px] h-[180px] bg-black">
                                <SelectGroup>
                                  {hours.map((hour) => <SelectItem key={hour} value={hour} >{hour}</SelectItem>)}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <Select name="min">
                              <SelectTrigger className="w-16 min-w-[64px]">
                                <SelectValue placeholder={String(slot.dateTime.getMinutes()).padStart(2, '0')} />
                              </SelectTrigger>
                              <SelectContent className="w-16 min-w-[64px] h-[140px] bg-black">
                                <SelectGroup>
                                  {minutes.map((minute) => <SelectItem key={minute} value={minute} >{minute}</SelectItem>)}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <Button size="icon" variant="outline">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        );
                      })}
                      <div className="w-full flex justify-end">
                        <Button size="icon" variant="outline" className="">
                          <Plus size={16} />
                        </Button>
                      </div>
                      <div className="w-full absolute bottom-0 left-0 flex p-2 gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full flex justify-between items-center gap-1 pr-1 hover:bg-transparent focus-visible:ring-transparent">
                              Select
                              <ChevronDown size={20} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="flex flex-col bg-black shadow-black shadow-md">
                            {daysOfWeek.map((day) => {
                              return (
                                <Button variant="ghost" size="sm" className="w-full justify-start pl-2" key={day}>
                                  {day}
                                </Button>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="sm" variant="outline">Duplicate</Button>
                      </div>
                    </>
                  ) : (
                    <div className="absolute top-0 bottom-0 flex flex-col p-2 justify-center items-center gap-2 mt-4">
                      <Text variant="p-small-thin" className="w-full text-center text-muted-foreground text-balance">There are no slots created yet</Text>
                      <Button size="sm" variant="outline">
                        <Plus className="size-4 -ml-2 mr-2"/>
                        Add slot
                      </Button>
                    </div>
                  )}
                  
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

