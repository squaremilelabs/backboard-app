"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Button, Link, Tab, TabList, Tabs } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import BackboardLogo from "../common/backboard-logo"

export default function RootHeader() {
  return (
    <header className="flex items-center justify-between p-2">
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
            <Button className="bg-canvas rounded px-2 text-sm">Sign In</Button>
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
      className="text-neutral-600 !ring-0 hover:underline focus-visible:text-purple-600"
    >
      <BackboardLogo size={28} color="currentColor" />
    </Link>
  )
}

type NavKey = "topics" | "tasks"

const baseTabClassName = twMerge(
  "px-1 sm:px-3",
  "border-2 rounded",
  "text-neutral-500",
  "cursor-pointer hover:bg-canvas",
  "flex items-center",
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
            "data-selected:canvas data-selected:border-blue-600 data-selected:text-blue-600"
          )}
        >
          <span>Topics</span>
        </Tab>
        <Tab
          id="tasks"
          href="/tasks"
          className={twMerge(
            baseTabClassName,
            "data-selected:bg-canvas data-selected:text-gold-600 data-selected:border-gold-600"
          )}
        >
          <span>Tasks</span>
        </Tab>
      </TabList>
    </Tabs>
  )
}
