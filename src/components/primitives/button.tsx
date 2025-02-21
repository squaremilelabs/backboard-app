"use client"

import { type AriaButtonOptions, useButton } from "react-aria"
import { useRef } from "react"
import { ClassNameValue, twMerge } from "tailwind-merge"

export function Button({
  children,
  className,
  ...props
}: { children: React.ReactNode } & AriaButtonOptions<"button"> & { className?: ClassNameValue }) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const { buttonProps } = useButton({ ...props }, ref)

  const mergedClassName = twMerge(
    "cursor-pointer hover:opacity-60",
    "data-pressed:scale-95",
    className
  )

  return (
    <button ref={ref} className={mergedClassName} {...buttonProps}>
      {children}
    </button>
  )
}
