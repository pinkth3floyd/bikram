import * as React from "react";
import { cn } from "../elements/ClassnameUtil";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base text-slate-900",
        "ring-offset-white transition-colors",
        "placeholder:text-slate-500",
        "focus:outline-none focus:border-blue-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea }; 