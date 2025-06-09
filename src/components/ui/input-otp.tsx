"use client";

import * as React from "react";
import { OTPInput } from "input-otp";
import { DashIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface SlotProps {
  char?: string | null;
  hasFakeCaret?: boolean;
  isActive?: boolean;
  placeholderChar?: string;
}

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SlotProps
>(({ char, hasFakeCaret, isActive, className, placeholderChar, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-10 w-10 rounded-md text-center border border-input bg-background text-sm transition-all",
        "flex items-center justify-center",
        "focus-within:z-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-background",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {char || <DashIcon className="h-4 w-4 text-muted-foreground" />}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSlot };
