import { type AriaButtonOptions, useButton } from "react-aria"
import { Slot } from "radix-ui"
import { useRef } from "react"

export function Button({
  asChild,
  children,
  ...props
}: { asChild?: boolean; children: React.ReactNode } & AriaButtonOptions<"button">) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const Component = asChild ? Slot.Root : "button"
  const { buttonProps } = useButton({ ...props, elementType: Component }, ref)

  return (
    <Component ref={ref} {...buttonProps}>
      {children}
    </Component>
  )
}
