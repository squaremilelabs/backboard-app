"use client"
import { twMerge } from "tailwind-merge"
import { Moon, SunDim } from "lucide-react"
import { Button, Link } from "react-aria-components"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import TopicsNav from "./topics-nav"
import BackboardLogo from "@/components/backboard-logo"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-dvh w-dvw grid-rows-[auto_1fr] overflow-auto">
      <Header />
      <div
        className={twMerge(
          "flex overflow-auto",
          "flex-col gap-4",
          "md:flex-row md:items-start md:justify-center"
        )}
      >
        <SignedIn>
          <nav
            className={twMerge("@container/nav", "sticky top-0 p-2 pb-0", "md:w-xs md:p-4 md:pr-0")}
          >
            <TopicsNav />
          </nav>
        </SignedIn>
        <main
          className={twMerge(
            "@container/main",
            "p-2 pt-0",
            "max-w-md md:grow md:p-4 md:pt-4 md:pl-0"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="bg-canvas flex items-center justify-between border-b p-2">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="focus-visible:text-gold-500 flex items-center justify-center gap-2 rounded text-neutral-500 !ring-0
            !outline-0"
        >
          <BackboardLogo size={20} color="currentColor" />
          <h1 className="text-lg font-medium">Backboard</h1>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <ThemeButton />
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

function ThemeButton() {
  const { setTheme, resolvedTheme } = useTheme()
  const Icon = resolvedTheme === "dark" ? Moon : SunDim
  return (
    <Button
      className="cursor-pointer text-neutral-500 !outline-0 hover:opacity-60"
      onPress={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Icon size={20} />
    </Button>
  )
}
