"use client"

import { useSearchParams } from "next/navigation"
import { twMerge } from "tailwind-merge"
import RootHeader from "./header"

const basePanelClassName = twMerge(
  "bg-canvas h-full max-h-full w-auto overflow-auto border-t-2 sm:rounded sm:border-2"
)

export function RootContainer({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const panelOpen = Boolean(searchParams.get("panel"))

  return (
    <div className="@container/root grid h-dvh w-dvw grid-rows-[auto_1fr]">
      <RootHeader />
      <div
        className={twMerge(
          "grid h-full max-h-full gap-2 overflow-auto !pt-0 sm:p-2",
          panelOpen ? "grid-cols-[1fr] lg:grid-cols-[1fr_1fr]" : "grid-cols-[1fr]"
        )}
      >
        <main
          className={twMerge(
            "@container/panel",
            basePanelClassName,
            panelOpen ? "hidden w-auto lg:grid" : null
          )}
        >
          {children}
        </main>
        <aside
          className={twMerge(
            "@container/panel",
            basePanelClassName,
            panelOpen ? "w-full lg:w-auto" : "hidden"
          )}
        >
          Panel
        </aside>
      </div>
    </div>
  )
}
