"use client"
import { twMerge } from "tailwind-merge"
import { CalendarIcon, LayersIcon, Moon, SunDim } from "lucide-react"
import { Button, Link } from "react-aria-components"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import Icon from "@mdi/react"
import { mdiMenu, mdiMenuOpen } from "@mdi/js"
import { SignedIn, UserButton } from "@clerk/nextjs"
import SidebarContent from "../sidebar"
import { useSessionStorageUtility } from "@/lib/browser"
import { iconBox, interactive } from "@/styles/class-names"
import useRouterUtility from "@/lib/router-utility"
import { getISOWeekString } from "@/lib/utils-timeslot"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen] = useSessionStorageUtility("sidebar-open", true)
  return (
    <div className={"flex h-dvh max-h-dvh w-dvw max-w-dvw items-start"}>
      <aside
        className={twMerge(
          "h-full",
          sidebarOpen ? "block w-[350px] min-w-[350px]" : "hidden w-0",
          "overflow-hidden transition-all transition-discrete"
        )}
      >
        <Sidebar />
      </aside>
      <div className="grid h-full w-full min-w-sm grow grid-rows-[auto_minmax(0,1fr)]">
        <Header />
        <main className="flex flex-col items-center-safe overflow-auto">{children}</main>
      </div>
    </div>
  )
}

function Header() {
  const [sidebarOpen, setSidebarOpen] = useSessionStorageUtility("sidebar-open", true)
  return (
    <header className="flex h-50 items-center gap-16 px-16">
      <Button
        onPress={() => setSidebarOpen(true)}
        className={twMerge(
          interactive({ hover: "background" }),
          "items-center gap-8",
          "rounded-md p-4",
          sidebarOpen ? "hidden opacity-0" : "flex opacity-100 starting:opacity-0",
          "transition-opacity"
        )}
      >
        <Image
          alt="Backboard"
          src="/images/backboard-logo.svg"
          width={20}
          height={20}
          className="shadow-md"
        />
        <Icon path={mdiMenu} size="20px" className="text-neutral-400" />
      </Button>
      <div className="flex items-center gap-8">
        <NavLink id="backlog" />
        <NavLink id="calendar" />
      </div>
      <div className="grow" />
      <SignedIn>
        <ThemeButton />
        <UserButton />
      </SignedIn>
    </header>
  )
}

function Sidebar() {
  const [_, setSidebarOpen] = useSessionStorageUtility("sidebar-open", true)
  return (
    <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] divide-y border-r">
      <div className="box-content flex h-50 items-center gap-8 px-16">
        <Image
          alt="Backboard"
          src="/images/backboard-logo.svg"
          width={20}
          height={20}
          className="shadow-md"
        />
        <h1 className="text-lg font-semibold text-neutral-600">Backboard</h1>
        <div className="grow" />
        <Button
          onPress={() => setSidebarOpen(false)}
          className={twMerge(
            interactive({ hover: "background" }),
            iconBox({ size: "large" }),
            "text-neutral-400"
          )}
        >
          <Icon path={mdiMenuOpen} />
        </Button>
      </div>
      <SidebarContent />
    </div>
  )
}
function NavLink({ id }: { id: "backlog" | "calendar" }) {
  const router = useRouterUtility()
  const currentISOWeek = getISOWeekString(new Date())
  const isActive = router.pathParts[0] === id

  const Icon = id === "backlog" ? LayersIcon : CalendarIcon
  const label = id === "backlog" ? "Backlog" : "Calendar"
  const href = id === "backlog" ? "/backlog/triage" : `/calendar/${currentISOWeek}`

  return (
    <Link
      href={href}
      isDisabled={isActive}
      className={twMerge(
        interactive({ hover: "background" }),
        "flex items-center gap-4",
        "rounded-md border px-8 py-2 text-neutral-500",
        isActive ? "bg-canvas border-neutral-300 font-medium text-neutral-950" : ""
      )}
    >
      <div className={iconBox({ size: "small", className: isActive ? "text-gold-500" : "" })}>
        <Icon />
      </div>
      <p>{label}</p>
    </Link>
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
      className={twMerge(interactive({ hover: "background" }), iconBox({ size: "large" }))}
      onPress={() => setTheme(selected === "dark" ? "light" : "dark")}
    >
      <Icon />
    </Button>
  )
}
