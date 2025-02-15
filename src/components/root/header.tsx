"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import Link from "next/link"
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
            <button className="rounded px-2 text-sm">Sign In</button>
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

const navLinkClassName = twMerge(
  // Base (Always)
  "flex items-center p-2 rounded border-b-2",
  // Default (Unselected)
  "text-neutral-400 border-transparent",
  // Hovering
  "hover:bg-neutral-100 cursor-pointer",
  // Pressing
  "data-pressed:scale-95",
  // Focused
  "!ring-0 focus-visible:bg-neutral-100"
)

const selectedNavLinkClassName = twMerge(
  // Selected
  "border-neutral-600 text-neutral-600 font-medium rounded-b-none"
)

function Navigation() {
  const pathname = usePathname()

  return (
    <nav className={twMerge("flex items-stretch space-x-2")}>
      <Link
        href="/topics"
        className={twMerge(
          navLinkClassName,
          pathname.startsWith("/topics") && selectedNavLinkClassName
        )}
      >
        Topics
      </Link>
      <Link
        href="/tasks"
        className={twMerge(
          navLinkClassName,
          pathname.startsWith("/tasks") && selectedNavLinkClassName
        )}
      >
        Tasks
      </Link>
    </nav>
  )
}
