"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

// ... (other components like Dialog, DialogTrigger, etc. remain the same)

// Base DialogContent component
const BaseDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={cn(
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
      className
    )}
    {...props}
  >
    {children}
  </DialogPrimitive.Content>
))
BaseDialogContent.displayName = "BaseDialogContent"

// HOCs for different features
const withAnimation = (Component: React.ComponentType<any>) => {
  return React.forwardRef<any, any>((props, ref) => (
    <Component
      ref={ref}
      className={cn(
        "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        props.className
      )}
      {...props}
    />
  ))
}

const withCloseButton = (Component: React.ComponentType<any>) => {
  return React.forwardRef<any, any>((props, ref) => (
    <Component ref={ref} {...props}>
      {props.children}
      <DialogPrimitive.Close className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </Component>
  ))
}

// Create variants using composition
const DialogContent = withAnimation(withCloseButton(BaseDialogContent))
DialogContent.displayName = "DialogContent"

const DialogContentWithoutAnimation = withCloseButton(BaseDialogContent)
DialogContentWithoutAnimation.displayName = "DialogContentWithoutAnimation"

const DialogContentWithoutClose = withAnimation(BaseDialogContent)
DialogContentWithoutClose.displayName = "DialogContentWithoutClose"

const DialogContentWithoutAnimationAndClose = BaseDialogContent
DialogContentWithoutAnimationAndClose.displayName = "DialogContentWithoutAnimationAndClose"

// Wrapper component for consistent usage
const DialogContentWrapper = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    variant?: 'default' | 'withoutAnimation' | 'withoutClose' | 'withoutAnimationAndClose'
  }
>(({ variant = 'default', ...props }, ref) => {
  const DialogContentVariant = React.useMemo(() => {
    switch (variant) {
      case 'withoutAnimation':
        return DialogContentWithoutAnimation
      case 'withoutClose':
        return DialogContentWithoutClose
      case 'withoutAnimationAndClose':
        return DialogContentWithoutAnimationAndClose
      default:
        return DialogContent
    }
  }, [variant])

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogContentVariant ref={ref} {...props} />
    </DialogPortal>
  )
})
DialogContentWrapper.displayName = "DialogContentWrapper"

export {
  Dialog,
  DialogTrigger,
  DialogContentWrapper as DialogContent,
  // ... (other exports remain the same)
}