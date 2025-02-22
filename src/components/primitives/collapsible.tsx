"use client"
import { Collapsible as RadixCollapsible } from "radix-ui"
import React, { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"
import { ClassNameValue, twMerge } from "tailwind-merge"

export default function Collapsible({
  defaultOpen,
  titleContent,
  titleClassName,
  panelContent,
  panelClassName,
}: {
  defaultOpen?: boolean
  titleContent: React.ReactNode
  titleClassName?: ClassNameValue
  panelContent: React.ReactNode
  panelClassName?: ClassNameValue
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (defaultOpen) {
      setOpen(true)
    }
  }, [defaultOpen])

  return (
    <RadixCollapsible.Root open={open} onOpenChange={setOpen}>
      <RadixCollapsible.Trigger
        className={twMerge(
          "flex cursor-pointer items-center gap-1 hover:opacity-50",
          titleClassName
        )}
      >
        <ChevronRight size={20} className={open ? "rotate-90" : "rotate-0"} />
        {titleContent}
      </RadixCollapsible.Trigger>
      <RadixCollapsible.Content className={twMerge("", panelClassName)}>
        {panelContent}
      </RadixCollapsible.Content>
    </RadixCollapsible.Root>
  )
}
