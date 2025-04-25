import { tv } from "tailwind-variants"

export const cell = tv({
  base: "flex items-center rounded-md",
  variants: {
    size: {
      compact: "p-2 min-h-24",
      default: "p-4 min-h-28",
    },
    interactive: {
      true: ["hover:bg-neutral-200", "cursor-pointer"],
    },
    disabled: {
      true: ["cursor-not-allowed", "opacity-50"],
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export const panel = tv({
  base: ["flex flex-col gap-16 p-16", "bg-canvas border-2 border-neutral-300", "rounded-lg"],
})

export const box = tv({
  base: "flex items-center",
  variants: {
    size: {
      small: "px-4 h-28",
      medium: "px-8 h-36",
      large: "px-12 h-44",
      xlarge: "px-16 h-52",
    },
  },
})
