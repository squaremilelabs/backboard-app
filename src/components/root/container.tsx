"use client"

import { Bookmark, SquareCheck } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Link } from "react-aria-components"
import { twMerge } from "tailwind-merge"

export function RootContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedPageKey, setSelectedPageKey] = useState<"tasks" | "topics" | null>(null)
  useEffect(() => {
    if (pathname.startsWith("/tasks")) setSelectedPageKey("tasks")
    else if (pathname.startsWith("/topics")) setSelectedPageKey("topics")
    else setSelectedPageKey(null)
  }, [pathname])

  const [panelOpen, setPanelOpen] = useState(false)
  useEffect(() => {
    if (searchParams.has("panel")) setPanelOpen(true)
    else setPanelOpen(false)
  }, [searchParams])

  return (
    <div className="grid h-screen w-screen grid-rows-[auto_1fr]">
      {/* HEADER */}
      <header className="flex items-stretch justify-between p-1 !pb-0 sm:p-2">
        {/* HEADER / NAV */}
        <div className="flex items-stretch space-x-1 sm:space-x-2">
          {/* <div className="flex items-center rounded bg-neutral-900 px-4 text-neutral-50 dark:bg-black dark:text-white">
            <h1 className="font-medium">Backboard</h1>
          </div> */}
          <Link
            href="topics"
            className={twMerge(
              "flex items-center space-x-2 rounded border-2 px-4 py-2 text-blue-600 hover:opacity-80",
              selectedPageKey === "topics"
                ? "bg-white font-semibold dark:bg-black"
                : "text-neutral-600"
            )}
          >
            <Bookmark size={20} />
            <span>Topics</span>
          </Link>
          <Link
            href="tasks"
            className={twMerge(
              "text-gold-600 flex items-center space-x-2 rounded border-2 px-4 py-2 hover:opacity-80",
              selectedPageKey === "tasks"
                ? "bg-white font-semibold dark:bg-black"
                : "text-neutral-600"
            )}
          >
            <SquareCheck size={20} />
            <span>Tasks</span>
          </Link>
        </div>
        {/* HEADER/AUTH */}
        <div className="flex items-center px-4"></div>
      </header>
      {/* MAIN */}
      <div
        className={twMerge(
          "grid h-full max-h-full gap-2 overflow-auto pt-1 sm:p-2",
          panelOpen ? "grid-cols-[1fr] lg:grid-cols-[1fr_1fr]" : "grid-cols[1fr]"
        )}
      >
        <main
          className={twMerge(
            "@container/panel h-full max-h-full w-auto overflow-auto border-t-2 bg-white sm:rounded sm:border-2 dark:bg-black",
            panelOpen ? "hidden w-auto lg:flex" : null
          )}
        >
          {children}
        </main>
        <aside
          className={twMerge(
            "@container/panel h-full max-h-full w-auto overflow-auto border-t-2 bg-white sm:rounded sm:border-2 dark:bg-black",
            panelOpen ? "w-full lg:w-auto" : "hidden"
          )}
        >
          aside
        </aside>
      </div>
    </div>
  )
}
