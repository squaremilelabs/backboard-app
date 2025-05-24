"use client"
import { twMerge } from "tailwind-merge"
import { Button, Link } from "react-aria-components"
import React, { useEffect } from "react"
import Image from "next/image"
import Icon from "@mdi/react"
import { mdiMenu, mdiMenuOpen } from "@mdi/js"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { ArrowLeftIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { WeekNavigator } from "../portables/week-navigator"
import { SidebarContent } from "./sidebar-content"
import { useSessionStorageUtility } from "@/lib/storage-utility"
import { iconBox, interactive } from "@/styles/class-names"
import { useRouterUtility } from "@/lib/router-utility"

export function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen] = useSessionStorageUtility("sidebar-open", true)
  const { setTheme } = useTheme()
  useEffect(() => setTheme("system"), [setTheme])
  return (
    <div className={"flex h-dvh max-h-dvh w-dvw max-w-dvw items-start"}>
      <aside
        className={twMerge(
          "h-full",
          "overflow-hidden transition-all transition-discrete",
          sidebarOpen ? "w-full md:block md:w-[350px] md:min-w-[350px]" : "hidden w-0"
        )}
      >
        <Sidebar />
      </aside>
      <div
        className={twMerge(
          "grid h-full w-full grow grid-rows-[auto_minmax(0,1fr)]",
          sidebarOpen ? "hidden md:grid" : ""
        )}
      >
        <Header />
        <main className="flex flex-col items-center-safe overflow-auto">{children}</main>
      </div>
    </div>
  )
}

function Header() {
  const router = useRouterUtility()
  return (
    <header className="flex h-50 items-center gap-16 px-16">
      <div className="hidden md:block">
        <SidebarTrigger />
      </div>
      {router.basePath === "calendar" ? (
        <>
          <WeekNavigator />
          <div className="grow" />
        </>
      ) : (
        <div className="flex grow items-center gap-8">
          <Link
            href="/calendar"
            className={twMerge(
              interactive({ hover: "background" }),
              "flex h-24 items-center gap-4",
              "text-neutral-500",
              "rounded-md px-4"
            )}
          >
            <ArrowLeftIcon size={16} />
            Back to calendar
          </Link>
        </div>
      )}
      <div className="block md:hidden">
        <SidebarTrigger />
      </div>
      <div className="hidden md:block">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  )
}

function SidebarTrigger() {
  const [sidebarOpen, setSidebarOpen] = useSessionStorageUtility("sidebar-open", true)
  return (
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
        width={16}
        height={16}
        className="shadow-md"
      />
    </Button>
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
        <div className="flex h-50 md:hidden">
          <UserButton />
        </div>
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
