"use client"
import { ChevronDown } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { Button, Dialog, DialogTrigger, Popover, Tab, TabList, Tabs } from "react-aria-components"
import { twMerge } from "tailwind-merge"

export default function TasksNav() {
  return (
    <div>
      <div className="hidden @3xl:grid">
        <TasksNavTabs mode="tabs" />
      </div>
      <div className="grid @3xl:hidden">
        <TasksNavDropdown />
      </div>
    </div>
  )
}

function getSelectedKey(pathname: string): "all" | "today" | "upcoming" | "review" | "closed" {
  return pathname === "/tasks/today"
    ? "today"
    : pathname === "/tasks/upcoming"
      ? "upcoming"
      : pathname === "/tasks/review"
        ? "review"
        : pathname === "/tasks/closed"
          ? "closed"
          : "all"
}

function TasksNavDropdown() {
  const pathname = usePathname()
  const labelMap = {
    all: "All",
    today: "Today",
    upcoming: "Upcoming",
    review: "To Review",
    closed: "Closed",
  }
  const selectedKey = getSelectedKey(pathname)
  return (
    <DialogTrigger>
      <Button
        className={twMerge(
          "p-2",
          "cursor-pointer",
          "flex items-center space-x-2",
          "border-b-2 border-neutral-100",
          "text-sm font-medium",
          "text-gold-600",
          "!ring-0",
          "focus-visible:bg-neutral-50"
        )}
      >
        <ChevronDown size={20} />
        <div>{labelMap[selectedKey]}</div>
      </Button>
      <Popover placement="bottom start" offset={4}>
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
  "opacity-50 data-selected:opacity-100 focus-within:opacity-100 hover:opacity-100",
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
        <Tab id="all" href={`/tasks${appendedPanelParam}`} className={twMerge(baseTabClassName)}>
          All
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
