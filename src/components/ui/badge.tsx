
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-primary to-primary-600 text-primary-foreground",
        secondary:
          "border-transparent bg-gradient-to-r from-secondary/90 to-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground",
        outline: "text-foreground",
        success: "border-transparent bg-gradient-to-r from-green-500 to-emerald-600 text-white",
        warning: "border-transparent bg-gradient-to-r from-amber-500 to-amber-600 text-white",
        info: "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white",
        premium: "border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_2px_5px_rgba(79,70,229,0.3)]",
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
