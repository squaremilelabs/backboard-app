"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { Button } from "react-aria-components"
import { X } from "lucide-react"
import RootHeader from "./header"
import PanelRouter from "./panel-router"

const basePanelClassName = twMerge(
  "bg-canvas h-full max-h-full w-auto overflow-auto border-t-2 sm:rounded sm:border-2"
)

export function RootContainer({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const panelOpen = Boolean(searchParams.get("panel"))

  const handleClosePanel = () => {
    // Remove the `panel` query parameter
    router.push(pathname)
  }

  return (
    <div className="@container/root grid h-dvh w-dvw grid-rows-[auto_1fr]">
      <RootHeader />
      <div
        className={twMerge(
          "relative grid h-full max-h-full gap-2 overflow-auto !pt-0 sm:p-2",
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
          <Button
            className={twMerge(
              "absolute top-0 right-0 flex items-center p-1 text-sm",
              "cursor-pointer data-pressed:scale-95",
              "bg-canvas rounded-bl sm:rounded",
              "border-2 sm:mr-2",
              "!ring-0 hover:bg-neutral-50 focus-visible:bg-neutral-100"
            )}
            onPress={handleClosePanel}
          >
            <X size={20} />
          </Button>
          <PanelRouter />
        </aside>
      </div>
    </div>
  )
}
