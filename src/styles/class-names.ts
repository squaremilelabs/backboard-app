import { tv, VariantProps } from "tailwind-variants"

export const interactive = tv({
  base: "not-disabled:cursor-pointer",
  variants: {
    hover: {
      fade: "not-disabled:hover:opacity-60",
      underline: "not-disabled:hover:underline",
      background: "not-disabled:hover:bg-neutral-200",
    },
  },
  defaultVariants: {
    hover: "fade",
  },
})

export type InteractiveProps = VariantProps<typeof interactive>

export const iconBox = tv({
  base: "inline-flex items-center justify-center rounded-md",
  variants: {
    size: {
      base: "size-20 min-w-20 [&_svg]:!size-16 [&_img]:!size-16",
      small: "size-16 min-w-16 [&_svg]:!size-12 [&_img]:!size-12 text-sm",
      large: "size-24 min-w-24 [&_svg]:!size-20 [&_img]:!size-20 text-lg",
    },
  },
  defaultVariants: {
    size: "base",
  },
})

export type IconBoxProps = VariantProps<typeof iconBox>

export const chip = tv({
  base: [
    "inline-flex items-center justify-center gap-4",
    "text-sm border min-w-40 w-fit px-8 py-1 truncate font-semibold",
    "[&_svg]:!size-14 [&_img]:!size-14",
  ],
  variants: {
    shape: {
      pill: "rounded-full",
      box: "rounded-md",
    },
    color: {
      neutral: "",
      gold: "",
      blue: "",
      red: "",
    },
    weight: {
      zero: "",
      light: "",
      medium: "",
      heavy: "",
    },
  },
  compoundVariants: [
    // neutral
    {
      color: "neutral",
      weight: "zero",
      class: "bg-transparent border-neutral-300 text-neutral-500",
    },
    {
      color: "neutral",
      weight: "light",
      class: "bg-neutral-100 border-neutral-200 text-neutral-600",
    },
    {
      color: "neutral",
      weight: "medium",
      class: "bg-neutral-200 border-neutral-300 text-neutral-600",
    },
    {
      color: "neutral",
      weight: "heavy",
      class: "bg-neutral-400 border-neutral-300 text-neutral-50",
    },
    // gold
    {
      color: "gold",
      weight: "zero",
      class: "bg-transparent border-gold-300 text-gold-500",
    },
    {
      color: "gold",
      weight: "light",
      class: "bg-gold-50 border-gold-200 text-gold-600",
    },
    {
      color: "gold",
      weight: "medium",
      class: "bg-gold-200 border-gold-300 text-gold-600",
    },
    {
      color: "gold",
      weight: "heavy",
      class: "bg-gold-400 border-gold-300 text-gold-50",
    },
    // blue
    {
      color: "blue",
      weight: "zero",
      class: "bg-transparent border-blue-300 text-blue-500",
    },
    {
      color: "blue",
      weight: "light",
      class: "bg-blue-50 border-blue-200 text-blue-600",
    },
    {
      color: "blue",
      weight: "heavy",
      class: "bg-blue-200 border-blue-300 text-blue-600",
    },
    {
      color: "blue",
      weight: "medium",
      class: "bg-blue-400 border-blue-300 text-blue-50",
    },
    // red
    {
      color: "red",
      weight: "zero",
      class: "bg-transparent border-red-300 text-red-600",
    },
    {
      color: "red",
      weight: "light",
      class: "bg-red-50 border-red-200 text-red-700",
    },
    {
      color: "red",
      weight: "medium",
      class: "bg-red-200 border-red-300 text-red-700",
    },
    {
      color: "red",
      weight: "heavy",
      class: "bg-red-700 border-red-300 text-red-50",
    },
  ],
  defaultVariants: {
    shape: "pill",
    color: "neutral",
    weight: "light",
  },
})

export type ChipProps = VariantProps<typeof chip>

export const popover = tv({
  base: "bg-canvas/30 border-2 rounded-lg p-16 backdrop-blur-lg",
})
