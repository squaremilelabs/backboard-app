"use client"

import { twMerge } from "tailwind-merge"
import { Moon, SunDim } from "lucide-react"
import { Button, Link } from "react-aria-components"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { EmojiStyle } from "emoji-picker-react"
import { EmojiDynamic } from "../primitives/common/emoji"
import WeekNavigator from "@/components/schedule/week-navigator"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-dvh max-h-dvh w-dvw max-w-dvw grid-rows-[auto_1fr]">
      <Header />
      <main
        className={twMerge(
          "@container/main",
          "grid h-full max-h-full w-full max-w-full grid-cols-1 grid-rows-1 overflow-auto p-8 !pt-0 md:p-16"
        )}
      >
        {children}
      </main>
    </div>
  )
}

function Header() {
  const pathname = usePathname()
  return (
    <header className="flex min-h-45 items-center gap-12 px-12 py-8 lg:px-20">
      <SignedIn>
        <nav className="flex items-center gap-8">
          <div className="px-4">
            <Image
              alt="Backboard"
              src="/images/backboard-logo.png"
              width={20}
              height={20}
              className="shadow-md"
            />
          </div>
          <NavLink emoji="1f4dd" title="Triage" href="/triage" />
          <NavLink emoji="1f5d3-fe0f" title="Schedule" href="/schedule" />
          {pathname.startsWith("/schedule") ? <WeekNavigator /> : null}
        </nav>
      </SignedIn>
      <div className="grow" />
      <SignedIn>
        <div className="flex items-center gap-8">
          <ThemeButton />
          <UserButton />
        </div>
      </SignedIn>
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
        "rounded-lg border-2 border-transparent",
        isActive
          ? ["bg-canvas cursor-auto border-neutral-300 font-medium text-neutral-950"]
          : ["hover:bg-canvas cursor-pointer text-neutral-500 hover:border-neutral-300"]
      )}
    >
      {isActive ? <EmojiDynamic unified={emoji} size={16} emojiStyle={EmojiStyle.APPLE} /> : null}
      <span>{title}</span>
    </Link>
  )
}
