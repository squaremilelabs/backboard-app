"use client"

import { Bookmark, SquareCheck } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "react-aria-components"
import { twMerge } from "tailwind-merge"

export function RootLayoutGrid({ children }: { children: React.ReactNode }) {
  const router = useRouter()
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
      <header className="flex items-stretch justify-between p-1 pb-0">
        {/* HEADER/NAV */}
        <div className="flex items-stretch">
          <Button
            className={twMerge(
              "flex items-center space-x-2 px-4 py-2 !ring-0",
              selectedPageKey === "tasks" ? "bg-gold-600 text-gold-50" : "text-neutral-400"
            )}
            onPress={() => router.push("/tasks")}
          >
            <SquareCheck size={20} />
            <span>Tasks</span>
          </Button>
          <Button
            className={twMerge(
              "flex items-center space-x-2 px-4 py-2 !ring-0",
              selectedPageKey === "topics" ? "bg-blue-600 text-blue-50" : "text-neutral-400"
            )}
            onPress={() => router.push("/topics")}
          >
            <Bookmark size={20} />
            <span>Topics</span>
          </Button>
        </div>
        {/* HEADER/AUTH */}
        <div className="flex items-center px-4"></div>
      </header>
      {/* MAIN */}
      <div
        className={twMerge(
          "grid h-full max-h-full gap-2 overflow-auto p-2",
          panelOpen ? "grid-cols-[1fr] lg:grid-cols-[1fr_1fr]" : "grid-cols[1fr]"
        )}
      >
        <main
          className={twMerge(
            "h-full max-h-full w-auto overflow-auto bg-white",
            panelOpen ? "hidden w-auto lg:flex" : null
          )}
        >
          {children}
        </main>
        <aside
          className={twMerge(
            "h-full max-h-full w-auto overflow-auto bg-white",
            panelOpen ? "w-full lg:w-auto" : "hidden"
          )}
        >
          aside
        </aside>
      </div>
    </div>
  )
}
