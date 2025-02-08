"use client"

import { usePathname } from "next/navigation"
import React from "react"
import { Link } from "react-aria-components"
import { twMerge } from "tailwind-merge"

export function Placeholder({
  className,
  content,
}: {
  className?: string
  content?: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <div className={twMerge("h-[1000px] w-full", className)}>
      {content ?? <Link href={`${pathname}?panel=dev`}>Open Panel</Link>}
    </div>
  )
}
