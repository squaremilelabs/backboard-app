"use client"
import { useSearchParams } from "next/navigation"
import { twMerge } from "tailwind-merge"
import RootHeader from "./header"
import PanelRouter from "./panel-router"

const sectionClassName = twMerge("h-full max-h-full overflow-auto grid grid-rows-1 grid-cols-1")

export function RootContainer({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const panelOpen = Boolean(searchParams.get("panel"))

  return (
    <div className="@container/root grid h-dvh w-dvw grid-rows-[auto_1fr] divide-y">
      <RootHeader />
      <div
        className={twMerge(
          "relative grid h-full max-h-full overflow-auto",
          panelOpen ? "grid-cols-[1fr] divide-x md:grid-cols-[1fr_1fr]" : "grid-cols-[1fr]"
        )}
      >
        <main
          className={twMerge(
            "@container/section",
            sectionClassName,
            panelOpen ? "hidden w-auto md:grid" : null
          )}
        >
          {children}
        </main>
        <aside
          className={twMerge(
            "@container/section",
            sectionClassName,
            panelOpen ? "w-full md:w-auto" : "hidden"
          )}
        >
          <PanelRouter />
        </aside>
      </div>
    </div>
  )
}
