"use client"
import { twMerge } from "tailwind-merge"
import {
  usePathname,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
  useRouter,
} from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "react-aria-components"

export default function RootMain({
  children,
  aside,
}: {
  children: React.ReactNode
  aside: React.ReactNode
}) {
  const pathname = usePathname()
  const segments = useSelectedLayoutSegments()
  const router = useRouter()
  const asideSegment = useSelectedLayoutSegment("aside")
  const [isAsideOpen, setIsAsideOpen] = useState(asideSegment !== null)

  useEffect(() => {
    if (asideSegment) {
      if (pathname.includes(asideSegment)) {
        setIsAsideOpen(true)
      } else {
        setIsAsideOpen(false)
      }
    } else {
      setIsAsideOpen(false)
    }
  }, [pathname, asideSegment])

  const closeAside = useCallback(() => {
    if (!asideSegment) return
    if (!segments.includes(asideSegment)) {
      router.push("/" + segments.join("/"))
    }
  }, [segments, asideSegment, router])

  return (
    <div
      className={twMerge(
        "@container/main",
        "grid grid-rows-1 overflow-auto",
        isAsideOpen ? "grid-cols-1 @md:grid-cols-2" : "grid-cols-1"
      )}
    >
      <main
        className={twMerge(
          "@container/panel",
          "grid grid-cols-1 grid-rows-1 overflow-auto",
          isAsideOpen ? "hidden @md:grid @md:w-auto" : ""
        )}
      >
        {children}
      </main>
      <aside
        className={twMerge(
          "@container/panel",
          "grid grid-cols-1 grid-rows-1 overflow-auto",
          isAsideOpen ? "" : "hidden"
        )}
      >
        <div className="grid grid-cols-1 grid-rows-[auto_1fr] overflow-auto @md/main:border-l">
          <div
            className={twMerge(
              "flex p-2",
              // responsive background color & border
              "@md/main:border-b @md/main:px-2"
            )}
          >
            <Button
              onPress={closeAside}
              className="flex w-full cursor-pointer items-center space-x-1 text-neutral-600 hover:text-neutral-800"
            >
              {/* Show "Close" if displayed as an aside (desktop) */}
              <X className="hidden @md/main:block" size={16} />
              <span className="hidden text-sm @md/main:block">Close</span>
              {/* Show "Back" if displayed in full screen (mobile) */}
              <ArrowLeft className="@md/main:hidden" size={16} />
              <span className="text-sm @md/main:hidden">Back</span>
            </Button>
          </div>
          <div className="overflow-auto rounded">{aside}</div>
        </div>
      </aside>
    </div>
  )
}
