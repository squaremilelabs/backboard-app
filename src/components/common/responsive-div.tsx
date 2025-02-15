import { ClassNameValue, twMerge } from "tailwind-merge"

export default function ResponsiveDiv({
  children,
  className,
  width,
}: {
  children: React.ReactNode
  className?: ClassNameValue
  width: "xs" | "sm" | "md" | "lg" | "xl" | "full"
}) {
  return (
    <div
      className={twMerge(
        "max-w-full",
        width !== "full" ? "justify-self-center" : "w-full",
        width === "xs" ? "w-xs" : "",
        width === "sm" ? "w-sm" : "",
        width === "md" ? "w-md" : "",
        width === "lg" ? "w-lg" : "",
        width === "xl" ? "w-xl" : "",
        className
      )}
    >
      {children}
    </div>
  )
}
