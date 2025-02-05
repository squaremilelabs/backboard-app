"use client"

import { Bookmark, SquareCheck } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "react-aria-components"
import { twMerge } from "tailwind-merge"

export function RootLayoutGrid({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="grid h-screen w-screen grid-rows-[auto_1fr]">
      <header className="flex items-stretch border-b border-neutral-200">
        <div className="flex items-stretch">
          <h1 className="border-r-1 border-neutral-200 bg-neutral-800 p-2 font-medium text-neutral-100">
            Backboard
          </h1>
          <Button
            className={twMerge(
              "flex items-center space-x-1 border-r-1 border-neutral-200 p-2 !ring-0",
              pathname.startsWith("/tasks") ? "bg-gold-600 text-gold-50" : "text-neutral-600"
            )}
            onPress={() => router.push("/tasks")}
          >
            <SquareCheck size={20} />
            <span>Tasks</span>
          </Button>
          <Button
            className={twMerge(
              "flex items-center space-x-1 border-r-1 border-neutral-200 p-2 !ring-0",
              pathname.startsWith("/topics") ? "bg-blue-600 text-blue-50" : "text-neutral-600"
            )}
            onPress={() => router.push("/topics")}
          >
            <Bookmark size={20} />
            <span>Topics</span>
          </Button>
        </div>
      </header>
      <main className="max-h-full overflow-auto">{children}</main>
    </div>
  )
}
