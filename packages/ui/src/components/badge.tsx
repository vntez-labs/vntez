import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@workspace/ui/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-brand-hover",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive/15 text-destructive border-destructive/20 shadow hover:bg-destructive/20",
        outline: "text-foreground border-border bg-card/60",
        brand:
          "border-transparent bg-primary/10 text-primary dark:bg-primary/20 font-semibold border-primary/20",
        success:
          "border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border-emerald-500/20",
        warning:
          "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border-amber-500/20",
      },
      size: {
        sm: "px-2.5 py-0.5 text-[11px]",
        default: "px-3 py-1 text-xs font-medium",
        lg: "px-4 py-1.5 text-xs font-bold uppercase tracking-wider",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
