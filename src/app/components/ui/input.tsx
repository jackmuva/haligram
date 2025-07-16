import { InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", ...props }, ref) => {
  return (
    <input
      className={`border border-foreground/20 rounded-sm px-1 bg-background-muted ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";
