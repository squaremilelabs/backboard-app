"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Button, Link, Tab, TabList, Tabs } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import BackboardLogo from "../common/backboard-logo"

export default function RootHeader() {
  return (
    <header className="bg-canvas flex items-center justify-between p-2">
      <div className="flex items-center space-x-2">
        <Brand />
        <Navigation />
      </div>
      <div className="flex items-center">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button className="rounded px-2 text-sm">Sign In</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  )
}

function Brand() {
  return (
    <Link
      href="/"
      className="focus-visible:text-gold-600 h-[30px] w-[30px] rounded border-b-2 border-transparent text-neutral-500
        !ring-0"
    >
      <BackboardLogo size="100%" color="currentColor" />
    </Link>
  )
}

type NavKey = "topics" | "tasks"

const baseTabClassName = twMerge(
  // Base (Always)
  "flex items-center p-2 rounded border-b-2",
  // Default (Unselected)
  "text-neutral-400 border-transparent",
  // Hovering
  "hover:bg-neutral-50 cursor-pointer",
  // Pressing
  "data-pressed:scale-95",
  // Selected
  "data-selected:border-neutral-600 data-selected:text-neutral-600 data-selected:font-medium data-selected:rounded-b-none",
  // Focused
  "!ring-0 focus-visible:bg-neutral-100"
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
      <TabList className={twMerge("flex items-stretch space-x-2")}>
        <Tab id="topics" href="/topics" className={twMerge(baseTabClassName)}>
          <span>Topics</span>
        </Tab>
        <Tab id="tasks" href="/tasks" className={twMerge(baseTabClassName)}>
          <span>Tasks</span>
        </Tab>
      </TabList>
    </Tabs>
  )
}
