import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-colors outline-none md:text-sm",
        // Background and text colors
        "bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white",
        // Border colors
        "border-gray-200 dark:border-gray-700",
        // Placeholder
        "placeholder:text-gray-500 dark:placeholder:text-gray-400",
        // Focus states
        "focus:border-blue-500 dark:focus:border-app-primary-light focus:outline-none",
        // Disabled states
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // File input specific
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Selection
        "selection:bg-primary selection:text-primary-foreground",
        // Error states
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
