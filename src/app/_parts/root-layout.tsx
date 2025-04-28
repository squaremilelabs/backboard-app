"use client"
import { twMerge } from "tailwind-merge"
import { Moon, SunDim } from "lucide-react"
import { Button, Link } from "react-aria-components"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import ScheduleNavigator from "@/components/schedule/schedule-navigator"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-dvh max-h-dvh w-dvw max-w-dvw grid-rows-[auto_1fr]">
      <Header />
      <main className={twMerge("@container/main", "grid max-h-full p-16 pt-0")}>{children}</main>
    </div>
  )
}

function Header() {
  const pathname = usePathname()
  return (
    <header className="flex items-center px-16 py-8">
      <nav className="flex items-center gap-16">
        <div className="flex items-center gap-8">
          <NavLink emoji="📝" title="Triage" href="/triage" />
          <NavLink emoji="🗓️" title="Schedule" href="/schedule" />
          {pathname.startsWith("/schedule") ? <ScheduleNavigator /> : null}
        </div>
      </nav>
      <div className="grow" />
      <div className="flex items-center gap-8">
        <ThemeButton />
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

function ThemeButton() {
  const { setTheme, resolvedTheme } = useTheme()
  const [selected, setSelected] = useState<string | null>(null)
  useEffect(() => {
    if (resolvedTheme) {
      setSelected(resolvedTheme)
    }
  }, [resolvedTheme])

  if (!selected) return null

  const Icon = selected === "dark" ? Moon : SunDim
  return (
    <Button
      className={"cursor-pointer rounded-md hover:opacity-70"}
      onPress={() => setTheme(selected === "dark" ? "light" : "dark")}
    >
      <Icon size={20} />
    </Button>
  )
}

function NavLink({ emoji, title, href }: { emoji: string; title: string; href: string }) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link
      href={href}
      className={twMerge(
        "flex items-center gap-4",
        "px-8 py-2",
        "rounded-xl border-neutral-300",
        isActive
          ? ["bg-canvas cursor-auto border-2 font-medium text-neutral-950"]
          : ["hover:bg-canvas cursor-pointer text-neutral-500 hover:border"]
      )}
    >
      {isActive ? <span>{emoji}</span> : null}
      <span>{title}</span>
    </Link>
  )
}
