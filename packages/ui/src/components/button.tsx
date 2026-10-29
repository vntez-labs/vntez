import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@workspace/ui/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary text-primary-foreground hover:bg-brand-hover active:bg-[#c81b0f]",
        outline:
          "border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c121e] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-400 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white",
        secondary:
          "border border-transparent bg-secondary text-secondary-foreground hover:bg-slate-200 dark:hover:bg-slate-800",
        ghost:
          "border border-transparent hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800/60",
        destructive:
          "border border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 gap-1.5 rounded-lg px-2.5 text-xs",
        sm: "h-9 gap-1.5 rounded-lg px-3.5 text-xs font-semibold",
        default: "h-10 gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
        lg: "h-11 gap-2.5 rounded-xl px-5 py-2.5 text-sm sm:text-base font-semibold",
        xl: "h-12 sm:h-12 gap-2.5 rounded-full px-7 py-3 text-sm sm:text-base font-bold",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      className: cn(buttonVariants({ variant, size, className }), child.props?.className),
      ...props,
    });
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants }
