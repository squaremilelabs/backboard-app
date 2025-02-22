"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { usePathname, useSelectedLayoutSegments } from "next/navigation"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import BackboardLogo from "@/components/common/backboard-logo"

export default function RootNavbar() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  return (
    <header className="bg-canvas flex items-center justify-between border-b p-2">
      <div className="flex items-center space-x-2">
        {!isHome ? <Brand /> : null}
        <NavItems />
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
      className="focus-visible:text-gold-600 h-[30px] w-[30px] rounded text-neutral-950 !ring-0 !outline-0"
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
  "focus-visible:bg-neutral-100"
)

const selectedNavLinkClassName = twMerge(
  // Selected
  "border-neutral-600 text-neutral-900 font-medium rounded-b-none"
)

function NavItems() {
  const segments = useSelectedLayoutSegments()

  return (
    <nav className={twMerge("flex items-stretch space-x-2")}>
      <Link
        href="/topics"
        className={twMerge(
          navLinkClassName,
          segments.includes("topics") && selectedNavLinkClassName
        )}
      >
        Topics
      </Link>
      <Link
        href="/tasks"
        className={twMerge(navLinkClassName, segments[0] === "tasks" && selectedNavLinkClassName)}
      >
        Tasks
      </Link>
      <Link
        href="/people"
        className={twMerge(navLinkClassName, segments[0] === "people" && selectedNavLinkClassName)}
      >
        People
      </Link>
    </nav>
  )
}
