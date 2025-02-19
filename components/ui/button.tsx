// components/ui/button.tsx
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'default', size = 'default', isLoading, ...props }, ref) => {
    return (
      <button
        className={cn(
          "rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1",
          variant === 'default' && "bg-primary-600 text-white hover:bg-primary-700",
          variant === 'outline' && "border border-input bg-transparent hover:bg-secondary-100",
          size === 'default' && "h-9 px-4 py-2",
          size === 'lg' && "h-10 px-8",
          isLoading && "opacity-50 cursor-not-allowed",
          className
        )}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };