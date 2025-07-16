import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "icon" | "custom"
  size?: "sm" | "md" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "sm", children, ...props }, ref) => {
    const baseStyles = "cursor-pointer rounded-sm flex items-center justify-center space-x-2"

    const variantStyles = {
      default: "bg-stone-100 hover:bg-stone-100/10 text-slate-900 border-stone-200 border border-foreground ",
      icon: "font-normal rounded-sm bg-foreground/20 hover:bg-foreground/40",
      custom: ""
    }

    const sizeStyles = {
      sm: "px-2 py-1 text-base",
      md: "px-3 py-2 text-base",
      lg: "px-4 py-3 text-base"
    }

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

    return (
      <button
        className={combinedClassName}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
