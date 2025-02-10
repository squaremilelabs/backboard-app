"use client"

import { Bookmark, SquareCheck } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Link, Tab, TabList, Tabs } from "react-aria-components"
import { twMerge } from "tailwind-merge"

export default function RootHeader() {
  return (
    <header className="flex items-center justify-between p-2">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Brand />
        <Navigation />
      </div>
      <div>{/* Clerk button will go here */}</div>
    </header>
  )
}

function Brand() {
  const { resolvedTheme } = useTheme()
  const logoSrc = resolvedTheme === "dark" ? "/logo-neutral-300.png" : "/logo-neutral-600.png"
  return (
    <Link
      href="/"
      className="grid grid-cols-[20px] items-center gap-2 !ring-0 hover:underline focus-visible:underline
        sm:grid-cols-[20px_1fr]"
    >
      <Image src={logoSrc} alt="Backboard" width={20} height={20} />
      <h1 className="hidden text-xl font-semibold text-neutral-600 sm:block dark:text-neutral-700">
        Backboard
      </h1>
    </Link>
  )
}

type NavKey = "topics" | "tasks"

const baseTabClassName = twMerge(
  "px-1 sm:px-3",
  "border-2 rounded",
  "text-neutral-500",
  "cursor-pointer hover:bg-canvas",
  "flex items-center space-x-1",
  "data-pressed:scale-95",
  "data-selected:font-medium"
)

function Navigation() {
  const pathname = usePathname()
  const selectedKey: NavKey | null = pathname.startsWith("/topics")
    ? "topics"
    : pathname.startsWith("/tasks")
      ? "tasks"
      : null
  return (
    <Tabs selectedKey={selectedKey} orientation="horizontal" keyboardActivation="manual">
      <TabList className={twMerge("flex items-center space-x-2")}>
        <Tab
          id="topics"
          href="/topics"
          className={twMerge(
            baseTabClassName,
            "data-selected:border-blue-600 data-selected:bg-blue-600 data-selected:text-blue-50"
          )}
        >
          <Bookmark size={16} />
          <span>Topics</span>
        </Tab>
        <Tab
          id="tasks"
          href="/tasks"
          className={twMerge(
            baseTabClassName,
            "data-selected:bg-gold-600 data-selected:text-gold-50 data-selected:border-gold-600"
          )}
        >
          <SquareCheck size={16} />
          <span>Tasks</span>
        </Tab>
      </TabList>
    </Tabs>
  )
}
