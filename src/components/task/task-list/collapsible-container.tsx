import { ChevronRight } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components"
import { twMerge } from "tailwind-merge"

export default function TaskListCollapsibleContainer({
  titleContent,
  children,
  taskCount,
  defaultExpanded,
}: {
  titleContent: React.ReactNode
  children: React.ReactNode
  taskCount: number | null | undefined
  defaultExpanded?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (defaultExpanded) {
      setIsExpanded(true)
    }
  }, [defaultExpanded])

  return (
    <Disclosure isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
      <Heading>
        <Button slot="trigger" className="flex items-center p-1">
          <ChevronRight size={20} className={isExpanded ? "rotate-90" : "rotate-0"} />
          <div className="grow">{titleContent}</div>
          {typeof taskCount === "number" ? (
            <span
              className={twMerge(
                "rounded border border-neutral-300 p-2 text-sm",
                taskCount ? "bg-canvas text-neutral-950" : "bg-transparent text-neutral-500"
              )}
            >
              {taskCount}
            </span>
          ) : null}
        </Button>
      </Heading>
      <DisclosurePanel className="bg-canvas flex flex-col rounded-lg border p-2">
        {children}
      </DisclosurePanel>
    </Disclosure>
  )
}
