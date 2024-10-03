"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <CheckIcon className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

const CheckboxDays = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn('relative size-[88px] border border-border rounded-md bg-black shadow-md shadow-black', className )}
    {...props}
  >
    {children}
    <CheckboxPrimitive.Indicator className='h-full flex items-end justify-end p-1'>
      <div className='size-4 relative rounded-full text-background-sh shadow-md bg-primary'>
        <CheckIcon className='size-3.5 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-background-sh' />
      </div>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
CheckboxDays.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox, CheckboxDays }
