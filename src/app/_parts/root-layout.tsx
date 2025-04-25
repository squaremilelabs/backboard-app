"use client"
import { twMerge } from "tailwind-merge"
import { Moon, SunDim } from "lucide-react"
import { Button, Link } from "react-aria-components"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import BackboardLogo from "@/components/common/backboard-logo"
import { cell } from "@/styles/class-names"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-dvh w-dvw grid-rows-[auto_1fr] overflow-auto">
      <Header />
      <main className={twMerge("@container/main", "overflow-auto p-16 pt-0")}>{children}</main>
    </div>
  )
}

function Header() {
  return (
    <header className="flex items-center px-16 py-8">
      <nav className="flex items-center gap-16">
        <Link href="/" className={twMerge(cell({ interactive: true }), "gap-4 text-neutral-600")}>
          <BackboardLogo size={20} />
          <h1 className="text-xl font-medium">Backboard</h1>
        </Link>
        <div className="flex items-center gap-8">
          <NavLink title="Triage" href="/triage" />
          <NavLink title="Schedule" href="/schedule" />
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
      className={cell({ interactive: true })}
      onPress={() => setTheme(selected === "dark" ? "light" : "dark")}
    >
      <Icon size={20} />
    </Button>
  )
}

function NavLink({ title, href }: { title: string; href: string }) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link
      href={href}
      className={twMerge(
        cell({ interactive: true }),
        "px-8 py-4",
        "rounded-md",
        isActive
          ? "border-2 border-neutral-300 bg-neutral-100 text-neutral-950"
          : "text-neutral-600"
      )}
    >
      {title}
    </Link>
  )
}
