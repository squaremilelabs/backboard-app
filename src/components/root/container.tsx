"use client"

import { Bookmark, SquareCheck } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { Nav } from "../common/navigation"

export function RootContainer({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()

  const [panelOpen, setPanelOpen] = useState(false)
  useEffect(() => {
    if (searchParams.has("panel")) setPanelOpen(true)
    else setPanelOpen(false)
  }, [searchParams])

  return (
    <div className="@container/root grid h-dvh w-dvw grid-rows-[auto_1fr]">
      {/* HEADER */}
      <header className="flex items-stretch justify-between p-1 !pb-0 sm:p-2">
        {/* HEADER / NAV */}
        <div className="flex items-stretch space-x-1 sm:space-x-2">
          <Nav
            type="links"
            items={[
              { hrefOrId: "/topics", title: "Topics", Icon: Bookmark },
              { hrefOrId: "/tasks", title: "Tasks", Icon: SquareCheck },
            ]}
            size="sm"
            color="canvas"
          />
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
            "bg-canvas @container/panel h-full max-h-full w-auto overflow-auto border-t-2 sm:rounded sm:border-2",
            panelOpen ? "hidden w-auto lg:grid" : null
          )}
        >
          {children}
        </main>
        <aside
          className={twMerge(
            "bg-canvas @container/panel h-full max-h-full w-auto overflow-auto border-t-2 sm:rounded sm:border-2",
            panelOpen ? "w-full lg:w-auto" : "hidden"
          )}
        >
          Panel
        </aside>
      </div>
    </div>
  )
}
