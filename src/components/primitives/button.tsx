import { type AriaButtonOptions, useButton } from "react-aria"
import { ElementType, useRef } from "react"

export function Button<T extends ElementType = "button">({
  children,
  ...props
}: { children: React.ReactNode } & AriaButtonOptions<T>) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const { buttonProps } = useButton({ ...props, elementType: "a" }, ref)
  return (
    <button ref={ref} {...buttonProps}>
      {children}
    </button>
  )
}
