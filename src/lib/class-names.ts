import { tv } from "tailwind-variants"

export const taskStatusBadge = tv({
  base: "flex items-center justify-center box-content border rounded-sm",
  variants: {
    size: {
      sm: "h-[16px] min-w-[16px] px-[1px] text-xs",
      lg: "h-[20px] min-w-[20px] px-[2px] text-sm",
    },
    status: {
      NOW: "bg-gold-100 text-gold-600 border-gold-500",
      LATER: "border-blue-500 bg-blue-100 text-blue-600",
      DONE: "bg-neutral-100 text-neutral-600 border-neutral-300",
    },
    hasCount: {
      true: "font-semibold",
      false: "!bg-canvas !text-neutral-400 !border-neutral-300",
    },
  },
})
