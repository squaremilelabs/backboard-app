"use client"
import { twMerge } from "tailwind-merge"
import RootHeader from "./header"
import AsideRouter from "./aside-router"
import useAside from "@/hooks/useAside"

const sectionClassName = twMerge("h-full max-h-full overflow-auto grid grid-cols-1 grid-rows-1")

export function RootContainer({ children }: { children: React.ReactNode }) {
  const aside = useAside()
  const asideOpen = Boolean(aside.active)

  return (
    <div className="@container/root grid h-dvh w-dvw grid-rows-[auto_1fr] divide-y overflow-auto">
      <RootHeader />
      <div
        className={twMerge(
          "relative grid h-full max-h-full overflow-auto",
          asideOpen ? "grid-cols-[1fr] divide-x md:grid-cols-[1fr_1fr]" : "grid-cols-[1fr]"
        )}
      >
        <main
          className={twMerge(
            "@container/panel-wrapper",
            sectionClassName,
            asideOpen ? "hidden w-auto md:grid" : null
          )}
        >
          {/* Inner wrapper stops at @lg breakpoint when aside is open */}
          <div className="@container/panel w-lg max-w-full justify-self-center">{children}</div>
        </main>
        <aside
          className={twMerge(
            "@container/panel-wrapper",
            sectionClassName,
            asideOpen ? "w-full md:w-auto" : "hidden"
          )}
        >
          <AsideRouter />
        </aside>
      </div>
    </div>
  )
}
