"use client"
import { twMerge } from "tailwind-merge"
import { Button } from "react-aria-components"
import React from "react"
import Image from "next/image"
import Icon from "@mdi/react"
import { mdiMenu, mdiMenuOpen } from "@mdi/js"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { SidebarContent } from "./sidebar-content"
import { WeekNavigator } from "./header-content/week-navigator"
import { ThemeButton } from "./header-content/theme-button"
import { useSessionStorageUtility } from "@/lib/storage-utility"
import { iconBox, interactive } from "@/styles/class-names"

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
