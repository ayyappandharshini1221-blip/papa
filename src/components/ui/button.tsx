import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] active:shadow-inner [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_5px_0_0_hsl(var(--primary-darker,0_0%_0%))] hover:shadow-[0_8px_20px_-10px_hsl(var(--primary))] active:translate-y-1 active:shadow-[0_0px_0_0_hsl(var(--primary-darker,0_0%_0%))] bg-gradient-to-b from-primary to-[hsl(var(--primary-darker))] before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-white/20",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_5px_0_0_hsl(var(--destructive-darker,0_0%_0%))] hover:shadow-[0_8px_20px_-10px_hsl(var(--destructive))] active:translate-y-1 active:shadow-[0_0px_0_0_hsl(var(--destructive-darker,0_0%_0%))] bg-gradient-to-b from-destructive to-[hsl(var(--destructive-darker))] before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-white/20",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_5px_0_0_hsl(var(--secondary-darker,0_0%_0%))] hover:shadow-[0_8px_20px_-10px_hsl(var(--secondary))] active:translate-y-1 active:shadow-[0_0px_0_0_hsl(var(--secondary-darker,0_0%_0%))] bg-gradient-to-b from-secondary to-[hsl(var(--secondary-darker))] before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-white/20",
        ghost: "hover:bg-accent hover:text-accent-foreground active:translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline active:translate-y-0.5",
        gold:
          "bg-gold text-primary-foreground shadow-[0_5px_0_0_hsl(var(--gold-darker,0_0%_0%))] hover:shadow-[0_8px_20px_-10px_hsl(var(--gold))] active:translate-y-1 active:shadow-[0_0px_0_0_hsl(var(--gold-darker,0_0%_0%))] bg-gradient-to-b from-gold to-[hsl(var(--gold-darker))] before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-white/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
