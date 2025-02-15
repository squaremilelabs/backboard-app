"use client"
import { Menu } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button, Dialog, DialogTrigger, Popover, Tab, TabList, Tabs } from "react-aria-components"
import { twMerge } from "tailwind-merge"

export default function TasksNav() {
  return (
    <div>
      <div className="hidden @md:grid">
        <TasksNavTabs mode="tabs" />
      </div>
      <div className="grid @md:hidden">
        <TasksNavDropdown />
      </div>
    </div>
  )
}

function getSelectedKey(pathname: string): "overview" | "today" | "upcoming" | "review" | "closed" {
  return pathname === "/tasks/today"
    ? "today"
    : pathname === "/tasks/upcoming"
      ? "upcoming"
      : pathname === "/tasks/review"
        ? "review"
        : pathname === "/tasks/closed"
          ? "closed"
          : "overview"
}

function TasksNavDropdown() {
  const pathname = usePathname()
  const labelMap = {
    overview: "Overview",
    today: "Today",
    upcoming: "Upcoming",
    review: "To Review",
    closed: "Closed",
  }
  const selectedKey = getSelectedKey(pathname)

  // close dialog on reroute
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <DialogTrigger isOpen={open} onOpenChange={setOpen}>
      <Button
        className={twMerge(
          "p-2",
          "cursor-pointer",
          "flex items-center justify-between",
          "border-b-2 border-neutral-100",
          "text-sm font-medium",
          "text-gold-600",
          "!ring-0",
          "focus-visible:bg-neutral-50"
        )}
      >
        <div>{labelMap[selectedKey]}</div>
        <Menu size={20} className="text-neutral-600" />
      </Button>
      <Popover placement="bottom end" offset={4}>
        <Dialog className="bg-canvas grid min-w-40 rounded border-2">
          <TasksNavTabs mode="dropdown" />
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}

const baseTabClassName = twMerge(
  "p-2",
  "flex items-center space-x-2",
  "opacity-50 data-selected:opacity-100 focus-visible:opacity-100 hover:opacity-100",
  "border-b-2 data-selected:border-gold-600",
  "data-pressed:scale-98",
  "text-sm data-selected:font-medium data-selected:text-gold-600",
  "!ring-0",
  "focus-visible:border-neutral-500 focus-visible:font-medium"
)

const baseBadgeClassName = twMerge(
  "bg-neutral-600",
  "text-sm text-neutral-50",
  "bg-neutral-600",
  "rounded px-1"
)

function TasksNavTabs({ mode }: { mode: "tabs" | "dropdown" }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const panelParam = searchParams.get("panel")
  const appendedPanelParam = panelParam ? `?panel=${panelParam}` : ""
  const selectedKey = getSelectedKey(pathname)

  return (
    <Tabs
      selectedKey={selectedKey}
      orientation={mode === "tabs" ? "horizontal" : "vertical"}
      keyboardActivation="manual"
    >
      <TabList className={twMerge(mode === "tabs" ? "grid grid-cols-5" : "grid")}>
        <Tab
          id="overview"
          href={`/tasks${appendedPanelParam}`}
          className={twMerge(baseTabClassName)}
        >
          Overview
        </Tab>
        <Tab
          id="today"
          href={`/tasks/today${appendedPanelParam}`}
          className={twMerge(baseTabClassName)}
        >
          <span>Today</span>
          <span className={twMerge(baseBadgeClassName)}>6hrs</span>
        </Tab>
        <Tab
          id="upcoming"
          href={`/tasks/upcoming${appendedPanelParam}`}
          className={twMerge(baseTabClassName)}
        >
          Upcoming
        </Tab>
        <Tab
          id="review"
          href={`/tasks/review${appendedPanelParam}`}
          className={twMerge(baseTabClassName)}
        >
          To Review
        </Tab>
        <Tab
          id="closed"
          href={`/tasks/closed${appendedPanelParam}`}
          className={twMerge(baseTabClassName)}
        >
          Closed
        </Tab>
      </TabList>
    </Tabs>
  )
}
