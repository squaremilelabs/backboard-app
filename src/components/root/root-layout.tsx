"use client"
import { twMerge } from "tailwind-merge"
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  ChevronLeftIcon,
  ChevronRightIcon,
  Moon,
  SunDim,
} from "lucide-react";
import { Button, Link } from "react-aria-components"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import Icon from "@mdi/react"
import { mdiMenu, mdiMenuOpen } from "@mdi/js"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { parse } from "date-fns"
import { usePathname } from "next/navigation"
import SidebarContent from "../sidebar"
import { useSessionStorageUtility } from "@/lib/browser"
import { iconBox, interactive } from "@/styles/class-names"
import { getISOWeekDates } from "@/lib/utils-timeslot"
import useWeekState from "@/lib/week-state"
import { formatDate } from "@/lib/utils-common"

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
        <Icon path={mdiMenu} size="20px" className="text-neutral-400" />
        <Image
          alt="Backboard"
          src="/images/backboard-logo.svg"
          width={20}
          height={20}
          className="shadow-md"
        />
      </Button>
      <div className="flex items-center gap-8">
        <WeekNavigator />
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

function WeekNavigator() {
  const pathname = usePathname()
  const { activeWeek, isCurrentWeek, setToNextWeek, setToPrevWeek, setToThisWeek } = useWeekState()
  const weekDates = getISOWeekDates(activeWeek)
  const firstDate = parse(weekDates[0], "yyyy-MM-dd", new Date())
  const isBeforeToday = firstDate < new Date()
  return (
    <div
      className={twMerge(
        "flex items-center gap-4 rounded-lg border p-4",
        pathname === "/calendar" ? "bg-canvas" : ""
      )}
    >
      <div className="flex items-center">
        <Button
          onPress={setToPrevWeek}
          className={twMerge(interactive({ hover: "background" }), iconBox({ size: "large" }))}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          onPress={setToNextWeek}
          className={twMerge(interactive({ hover: "background" }), iconBox({ size: "large" }))}
        >
          <ChevronRightIcon />
        </Button>
      </div>
      <div className="flex grow items-center justify-center gap-8">
        <Link
          href="/calendar"
          className={twMerge("font-medium", interactive({ hover: "underline" }))}
          isDisabled={pathname === "/calendar"}
        >
          {activeWeek}
        </Link>
        <span
          className={twMerge(
            "text-sm text-neutral-500",
            isCurrentWeek ? "text-gold-500 font-semibold" : ""
          )}
        >
          {isCurrentWeek ? "This week" : `Week of ${formatDate(firstDate)}`}
        </span>
      </div>
      {!isCurrentWeek ? (
        <Button
          onPress={setToThisWeek}
          className={twMerge(
            interactive({ hover: "background" }),
            iconBox({ size: "base" }),
            "text-gold-400"
          )}
        >
          {isBeforeToday ? <ArrowRightCircle /> : <ArrowLeftCircle />}
        </Button>
      ) : (
        <div className="w-4" />
      )}
    </div>
  )
}
