import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/core/ui/elements/ClassnameUtil";

const badgeVariants = cva(  
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary ring-primary/20",
        secondary: "bg-gray-50 text-gray-700 ring-gray-600/10",
        success: "bg-green-50 text-green-700 ring-green-600/10",
        destructive: "bg-red-50 text-red-700 ring-red-600/10",
        warning: "bg-yellow-50 text-yellow-700 ring-yellow-600/10",
        info: "bg-blue-50 text-blue-700 ring-blue-600/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }