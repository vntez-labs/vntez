import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Check, Minus } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "onChange"> {
  onChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, checked, defaultChecked, indeterminate, onCheckedChange, onChange, ...props }, ref) => {
  const handleCheckedChange = (
    newChecked: boolean,
    eventDetails: CheckboxPrimitive.Root.ChangeEventDetails
  ) => {
    onCheckedChange?.(newChecked, eventDetails);
    onChange?.(newChecked);
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={checked}
      defaultChecked={defaultChecked}
      indeterminate={indeterminate}
      onCheckedChange={handleCheckedChange}
      className={cn(
        "peer inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input bg-background/50 text-foreground shadow-2xs transition-all outline-none select-none cursor-pointer",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
        "data-checked:bg-primary data-checked:border-primary data-checked:text-primary-foreground",
        "data-indeterminate:bg-primary data-indeterminate:border-primary data-indeterminate:text-primary-foreground",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current animate-in zoom-in-75 duration-100">
        {indeterminate ? (
          <Minus className="size-3 stroke-[3]" />
        ) : (
          <Check className="size-3 stroke-[3]" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
