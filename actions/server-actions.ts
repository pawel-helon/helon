"use server"

import { db } from "@/lib/db";
import { Slot } from "@prisma/client";

export async function getSlotsForWeek(week: string[]) {
  const weekSlots = [] as {day: string, slots: Slot[]}[]

  for (const day of week) {
    const slots = await db.slot.findMany({
      where: {
        dateTime: {
          gte: new Date(`${day}T00:00:00.000Z`),
          lte: new Date(`${day}T23:59:59.999Z`)
        },
      },
      orderBy: {
        dateTime: "asc" 
      }
    }) as Slot[];
    weekSlots.push({day, slots})
  }
  if (!weekSlots) {
    return { message: "No slots fetched", status: 404 };
  } else {  
  return { message: "Slots fetched", status: 200, weekSlots };
  }
}

export async function updateSlotHour(slotId: string, dateTime: Date, hour: string) {
  const slot = await db.slot.update({
    where: {
      id: slotId,
    },
    data: {
      dateTime: new Date(dateTime.setHours(Number(hour)))
    }
  });

  if (!slot) {
    return { message: "Slot not updated", status: 404 };
  } else {
    return { message: "Slot updated", status: 200 };
  }
}

export async function updateSlotMinutes(slotId: string, dateTime: Date, minutes: string) {
  const slot = await db.slot.update({
    where: {
      id: slotId,
    },
    data: {
      dateTime: new Date(dateTime.setMinutes(Number(minutes)))
    }
  });

  if (!slot) {
    return { message: "Slot not updated", status: 404 };
  } else {
    return { message: "Slot updated", status: 200 };
  }
}

export async function addSlot(day: string) {
  const allTimes = [] as string[];
  for (let hour = 6; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      allTimes.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  const unavailableTimes = [] as string[];
  const slots = await db.slot.findMany({
    where: {
      dateTime: {
        gte: new Date(`${day}T00:00:00.000Z`),
        lte: new Date(`${day}T23:59:59.999Z`)
      },
    },
    select: {
      dateTime: true
    }
  }) as Slot[];
  for (const slot of slots) {
    unavailableTimes.push(slot.dateTime.toISOString().split('T')[1].slice(0, 5));
  }
  
  const availableTimes = allTimes.filter(time => !unavailableTimes.includes(time));

  const newSlot = await db.slot.create({
    data: {
      dateTime: new Date(`${day}T${availableTimes[0]}:00.000Z`),
    }
  })

  if (!newSlot) {
    return { message: "Slot not created", status: 404 };
  } else {
    return { message: "Slot created", status: 201 };
  }
}

export async function addRecurringSlot(day: string) {
  const allTimes: string[] = [];
  for (let hour = 6; hour <= 20; hour++) {
    for(let minute = 0; minute < 60; minute += 15) {
      allTimes.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
    }
  } 
  const unavailableTimes: string[] = [];
  const slots = await db.slot.findMany({
    where: {
      dateTime: {
        gte: new Date(`${day}T00:00:00.000Z`),
        lte: new Date(`${day}T23:59:59.999Z`)
      },
    },
    select: {
      dateTime: true
    }
  }) as Slot[];

  for (const slot of slots) {
    unavailableTimes.push(slot.dateTime.toISOString().split('T')[1].slice(0,5));
  }

  const availableTimes = allTimes.filter(time => !unavailableTimes.includes(time))

  const endOfYear = new Date(new Date(day).getFullYear(), 11, 31, 23, 59, 999);
  const recurringDates: Date[] = [];
  const currentRecurringDate = new Date(day);

  while (currentRecurringDate <= endOfYear) {
    recurringDates.push(new Date(currentRecurringDate));
    currentRecurringDate.setDate(currentRecurringDate.getDate() + 7);
  }

  let recurringDay: boolean = false;
  for (const date of recurringDates) {
    const recurringSlot = await db.slot.create({
      data: {
        dateTime: new Date(`${date.toISOString().split('T')[0]}T${availableTimes[0]}:00.000Z`),
        recurring: true
      }
    })

    if (!recurringSlot) {
      return { message: 'Failed to create slot', status: 500 }
    } else {
      recurringDay = true;
    }
  }

  if (!recurringDay) {
    return { message: 'Failed to create recurring slots', status: 500 }
  } else {
    return { message: 'Recurring slots creates', status: 201 }
  }
}

export async function deleteSlot(slotId: string) {
  const slot = await db.slot.delete({
    where: {
      id: slotId,
    }
  });

  if (!slot) {
    return { message: "Slot not deleted", status: 404 };
  } else {
    return { message: "Slot deleted", status: 202 };
  }
}

export async function undoDeleteSlot(slot: Slot) {
  const undoDeleteSlot = await db.slot.create({
    data: {
      dateTime: slot.dateTime,
      recurring: slot.recurring
    }
  });

  if (!undoDeleteSlot) {
    return { message: "Slot not restored", status: 404 };
  } else {
    return { message: "Slot restored", status: 201 };
  }
}

export async function duplicateSlots(dayToDuplicate: string, slotsForDuplicating: Slot[]) {
  const slots = await db.slot.deleteMany({
    where: {
      dateTime: {
        gte: new Date(`${dayToDuplicate}T00:00:00.000Z`),
        lte: new Date(`${dayToDuplicate}T23:59:59.999Z`)
      },
    },
  });

  if (!slots) {
    return { message: "No slots duplicated", status: 404 };
  } else {
    for (const slot of slotsForDuplicating) {
      const time = slot.dateTime.toISOString().split('T')[1];
      await db.slot.create({
        data: {
          dateTime: new Date(`${dayToDuplicate}T${time}`)
        }
      });
    }
    return { message: "Slots duplicated", status: 201 };
  }
}

export async function duplicateDay(days: string[], slots: Slot[]) {
  const currentDays = [] as { day: string, slots: Slot[] }[];
  
  for (const day of days) {
    const currentSlots = await db.slot.findMany({
      where: {
        dateTime: {
          gte: new Date(`${day}T00:00:00.000Z`),
          lte: new Date(`${day}T23:59:59.999Z`)
        }
      }
    }) as Slot[];

    if (!currentSlots) {
      return { message: 'Failed to fetch slots', status: 500 }
    }
    currentDays.push({day: day, slots: currentSlots});
    
    const deleteSlots = await db.slot.deleteMany({
      where: {
        dateTime: {
          gte: new Date(`${day}T00:00:00.000Z`),
          lte: new Date(`${day}T23:59:59.999Z`)
        }
      }
    })
    if (!deleteSlots) {
      return { message: 'Failed to delete slots', status: 500 }
    }
    for (const slot of slots) {
      const time = slot.dateTime.toISOString().split('T')[1];
      const createSlot = await db.slot.create({
        data: {
          dateTime: new Date(`${day}T${time}`),
          recurring: slot.recurring
        }
      })
      if (!createSlot) {
        return { message: 'Failed to create slots', status: 500 }
      }
    }
  }
  return { message: 'Day has been duplicated', status: 201, prevDays: currentDays }
}

export async function undoDuplicateDay(days: { day: string, slots: Slot[] }[]) {
  for (const day of days) {
    const deleteSlots = await db.slot.deleteMany({
      where: {
        dateTime: {
          gte: new Date(`${day.day}T00:00:00.000Z`),
          lte: new Date(`${day.day}T23:59:59.999Z`)
        }
      }
    })
    if (!deleteSlots) {
      return { message: 'Failed to delete slots', status: 500 }
    }
    for (const slot of day.slots) {
      const time = slot.dateTime.toISOString().split('T')[1];
      const createSlot = await db.slot.create({
        data: {
          dateTime: new Date(`${day.day}T${time}`),
          recurring: slot.recurring
        }
      })
      if (!createSlot) {
        return { message: 'Failed to create slots', status: 500 }
      }
    }
  }
  return { message: 'Day has been restored', status: 201 }
}

export async function setRecurringSlot(slot: Slot) {
  try {
    const updateSlot = await db.slot.update({
      where: { id: slot.id },
      data: { recurring: true }
    })

    if (!updateSlot) {
      return { message: 'Failed to update slot.', status: 500 }
    }

    const endOfYear = new Date(slot.dateTime.getFullYear(), 11, 31, 23, 59, 59, 999);
    const recurringDates: Date[] = [];

    const currentRecurringDate = new Date(slot.dateTime);
    currentRecurringDate.setDate(currentRecurringDate.getDate() + 7);
    
    while (currentRecurringDate <= endOfYear) {
      recurringDates.push(new Date(currentRecurringDate));
      currentRecurringDate.setDate(currentRecurringDate.getDate() + 7);
    }

    const recurringSlots = await db.slot.createMany({
      data: recurringDates.map(date => ({
        dateTime: new Date(date.setHours(
          slot.dateTime.getHours(),
          slot.dateTime.getMinutes(),
          slot.dateTime.getSeconds(),
          slot.dateTime.getMilliseconds()
        )),
        recurring: true
      })),
      skipDuplicates: true
    });

    if (recurringSlots.count === 0) {
      return { message: 'Failed to create recurring slots', status: 500 }
    } else {
      return { message: `Created ${recurringSlots.count} recurring slots`, status: 201 }
    }
  } catch (error) {
    return { message: 'An error occurred while setting recurring slots', status: 500 }
  }
}

export async function disableRecurringSlot(slot: Slot) {
  try {
    const updateSlot = await db.slot.update({
      where: { id: slot.id },
      data: { recurring: false }
    })

    if (!updateSlot) {
      return { message: 'Failed to update slot.', status: 500 }
    }

    const endOfYear = new Date(slot.dateTime.getFullYear(), 11, 31, 23, 59, 59, 999);
    const recurringDates: Date[] = [];

    const currentRecurringDate = new Date(slot.dateTime);
    currentRecurringDate.setDate(currentRecurringDate.getDate() + 7);
    
    while (currentRecurringDate <= endOfYear) {
      recurringDates.push(new Date(currentRecurringDate));
      currentRecurringDate.setDate(currentRecurringDate.getDate() + 7);
    }

    let recurringSlotsDeleted = false;
    for (const date of recurringDates) {
      const deletedSlot = await db.slot.delete({
        where: {
          dateTime: new Date(date.setHours(
            slot.dateTime.getHours(),
            slot.dateTime.getMinutes(),
            slot.dateTime.getSeconds(),
            slot.dateTime.getMilliseconds()
        ))}
      })
      if (deletedSlot) {
        recurringSlotsDeleted = true
      }
    }


    if (!recurringSlotsDeleted) {
      return { message: 'Failed to create recurring slots', status: 500 }
    } else {
      return { message: 'Removed recurring slots', status: 204 }
    }
  } catch (error) {
    return { message: 'An error occurred while setting recurring slots', status: 500 }
  }
}

export async function duplicateDaySlotsFor(dayToDuplicate: string, slots: Slot[]) {
  const date = new Date(dayToDuplicate)

  const deleteSlots = await db.slot.deleteMany({
    where: {
      dateTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999))
      }
    }
  })
  if (!deleteSlots) {
    return { message: 'Failed to delete slots', status: 500 };
  }

  let slotsDuplicated = false;
  for (const slot of slots) {
    const duplicateSlot = await db.slot.create({
      data: {
        dateTime: new Date(date.setHours(
          slot.dateTime.getHours(),
          slot.dateTime.getMinutes(),
          slot.dateTime.getSeconds(),
          slot.dateTime.getMilliseconds()
        ))
      }
    })
    if (!duplicateSlot) {
      return { message: 'Failed to duplicate slot', status: 500 }
    } else {
      slotsDuplicated = true;
    }
  }

  if (!slotsDuplicated) {
    return { message: 'Failed to duplicate slots', status: 500 }
  } else {
    return { message: 'Slots duplicated', status: 201 }
  }
}

export async function deleteSlots(day: string) {
  const deleteSlots = await db.slot.deleteMany({
    where: {
      dateTime: {
        gte: new Date(new Date(day).setHours(0,0,0,0)),
        lte: new Date(new Date(day).setHours(23,59,59,999))
      }
    }
  })
  if (!deleteSlots) {
    return { message: 'Failed to delete slots', status: 500 }
  } else {
    return { message: 'Slots deleted', status: 204 }
  }
}

export async function addSlots(day: string, slots: Slot[]) {
  const date = new Date(day)
  let slotsAdded = false;
  for (const slot of slots) {
    const addingSlot = await db.slot.create({
      data: {
        type: slot.type,
        dateTime: new Date(date.setHours(
          slot.dateTime.getHours(),
          slot.dateTime.getMinutes(),
          slot.dateTime.getSeconds(),
          slot.dateTime.getMilliseconds()
        )), 
        recurring: slot.recurring,
      }
    })
    if (!addingSlot) {
      return { message: 'Failed to add slot', status: 500 }
    } else {
      slotsAdded = true;
    }
  }

  if (!slotsAdded) {
    return { message: 'Failed to add slots', status: 500 }
  } else {
    return { message: 'Slots added', status: 201 }
  }
}

export async function setRecurringDay(day: string, slots: Slot[]) {
  try {
    const startRecurringDate = await db.recurringDate.create({
      data: {
        dateTime: new Date(day)
      }
    })
    if (!startRecurringDate) {
      return { message: 'Failed to create recurring day', status: 500 }
    }

    let updatedDay: boolean = false;
    for (const slot of slots) {
      const updatedSlot = await db.slot.update({
        where: { id: slot.id },
        data: { recurring: true }
      })
      if (updatedSlot) {
        updatedDay = true;
      }
    }

    if (!updatedDay) {
      return { message: 'Failed to update slots', status: 500 }
    }
    
    const endOfYear = new Date(new Date(day).getFullYear(), 11, 31, 23, 59, 999);
    const recurringDates: Date[] = [];

    const currentRecurringDate = new Date(day);
    currentRecurringDate.setDate((currentRecurringDate.getDate() + 7));

    while (currentRecurringDate <= endOfYear) {
      recurringDates.push(new Date(currentRecurringDate));
      currentRecurringDate.setDate(currentRecurringDate.getDate() + 7);
    }
    
    let recurringDay: boolean = false;
    
    for (const date of recurringDates) {
      const recurringDate = await db.recurringDate.create({
        data: { dateTime: date }
      })

      if (!recurringDate) {
        return { message: 'Failed to create recurring days', status: 500 }
      }

      for (const slot of slots) {
        const recurringSlot = await db.slot.create({
          data: {
            dateTime: new Date(date.setHours(
              slot.dateTime.getHours(),
              slot.dateTime.getMinutes(),
              slot.dateTime.getSeconds(),
              slot.dateTime.getMilliseconds()
            )),
            recurring: true
          }
        })
        if (recurringSlot) {
          recurringDay = true;
        }
      }
    }

    if (!recurringDay) {
      return { message: 'Failed to create recurring days', status: 500 }
    } else {
      return { message: 'Recurring days created', status: 201 }
    }
  } catch {
    return { mesage: 'An unexpected error occurred. Please try again later', status: 400}
  }
}

export async function checkRecurringDay(day: string) {
  const recurringDay = await db.recurringDate.findUnique({
    where: { dateTime: new Date(day) }
  })

  if (!recurringDay) {
    return { message: 'Recurring day not found', status: 204 }
  } else {
    return { message: 'Recurring day found', status: 200 }
  }
}

export async function checkRecurringDays(days: string[]) {
  const recurringDays: string[] = [];

  for (const day of days) {
    const recurringDay = await db.recurringDate.findUnique({
      where: { dateTime: new Date(day) }
    })
    if (recurringDay) {
      recurringDays.push(day);
    }
  }

  if (recurringDays.length === 0) {
    return { message: 'No recurring days found', status: 204, recurringDays }
  } else {
    return { message: 'Recurring days found', status: 200, recurringDays }
  }
}

export async function disableRecurringDay(day: string, slots: Slot[]) {
  try {
    const startRecurringDate = await db.recurringDate.delete({
      where: { dateTime: new Date(day) }
    })
    if (!startRecurringDate) {
      return { message: 'Failed to create recurring day', status: 500 }
    }
    
    let updatedDay: boolean = false;
    for (const slot of slots) {
      const updatedSlot = await db.slot.update({
        where: { id: slot.id },
        data: { recurring: false }
      })
      if (updatedSlot) {
        updatedDay = true;
      }
    }

    if (!updatedDay) {
      return { message: 'Failed to update slots', status: 500 }
    }
    
    const endOfYear = new Date(new Date(day).getFullYear(), 11, 31, 23, 59, 999);

    const recurringDates: Date[] = [];

    const currentRecurringDate = new Date(day);
    currentRecurringDate.setDate((currentRecurringDate.getDate() + 7));

    while (currentRecurringDate <= endOfYear) {
      recurringDates.push(new Date(currentRecurringDate));
      currentRecurringDate.setDate(currentRecurringDate.getDate() + 7);
    }
    
    let removedRecurringDaySlots: boolean = false;
    for (const date of recurringDates) {
      const recurringDate = await db.recurringDate.delete({
        where: { dateTime: date }
      })
      
      if (!recurringDate) {
        return { message: 'Failed to delete recurring days', status: 500 }
      }
      
      for (const slot of slots) {
        const recurringSlot = await db.slot.delete({
          where: {
            dateTime: new Date(date.setHours(
              slot.dateTime.getHours(),
              slot.dateTime.getMinutes(),
              slot.dateTime.getSeconds(),
              slot.dateTime.getMilliseconds()
            )),
            recurring: true
          }
        })
        if (recurringSlot) {
          removedRecurringDaySlots = true;
        }
      }
    }

    if (!removedRecurringDaySlots) {
      return { message: 'Failed to delete recurring days', status: 500 }
    }

    const removingdRecurringDates = await db.recurringDate.deleteMany({
      where: {
        dateTime: {
          in: recurringDates
        }
      }
    })

    if (!removingdRecurringDates) {
      return { message: 'Failed to delete recurring days', status: 500 }
    } else {
      return { message: 'Recurring days deleted', status: 204 }
    }
  } catch {
    return { mesage: 'An unexpected error occurred. Please try again later', status: 400}
  }
}
