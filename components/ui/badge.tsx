import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600 text-white shadow-md shadow-blue-500/30",
        secondary:
          "border-transparent bg-gray-700 text-gray-100",
        success:
          "border-transparent bg-green-600 text-white shadow-md shadow-green-500/30",
        outline: "border-gray-600 text-gray-300",
        glow: "border-transparent bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50",
        terminal: "border-2 border-cyan-500 bg-black text-cyan-400 font-mono rounded-none px-2 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

