"use client"
import { twMerge } from "tailwind-merge"
import { Archive, Moon, SunDim, X, Zap, ZapOff } from "lucide-react"
import { Button, Link } from "react-aria-components"
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import TopicsNav from "./topics-nav"
import BackboardLogo from "@/components/backboard-logo"
import { useCountTask } from "@/database/generated/hooks"
import { getWorkModeTasksWhereParam } from "@/lib/data/task"

const NO_TOPIC_NAV_PATHNAMES: string[] = ["/archive", "/work-mode"]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showTopicNav = !NO_TOPIC_NAV_PATHNAMES.includes(pathname)
  return (
    <div className="grid h-dvh w-dvw grid-rows-[auto_1fr] overflow-auto">
      <Header />
      <div
        className={twMerge(
          "flex overflow-auto",
          "flex-col gap-4",
          "md:flex-row md:items-start md:justify-center"
        )}
      >
        <SignedIn>
          <nav
            className={twMerge(
              "@container/nav",
              "sticky top-0 z-10 p-2 pb-0",
              "md:p-4 md:pr-0",
              showTopicNav ? "md:w-xs" : "md:w-[100px]"
            )}
          >
            {showTopicNav ? (
              <TopicsNav />
            ) : (
              <div className="flex">
                <Link
                  href="/"
                  className="bg-canvas/50 flex items-center gap-1 rounded-lg border px-2 text-neutral-500 !outline-0
                    backdrop-blur-xl hover:opacity-60"
                >
                  <X size={14} />
                  Exit
                </Link>
              </div>
            )}
          </nav>
        </SignedIn>
        <main className={twMerge("@container/main", "p-2 pt-4", "max-w-md md:grow md:p-4 md:pl-2")}>
          {children}
        </main>
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="bg-canvas flex items-center justify-between border-b p-2">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="focus-visible:text-gold-500 flex items-center justify-center gap-2 rounded text-neutral-500 !ring-0
            !outline-0"
        >
          <BackboardLogo size={20} color="currentColor" />
          <h1 className="text-lg font-medium">Backboard</h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <SignedIn>
          <WorkModeLink />
          <Link href="/archive">
            <Archive size={16} className="cursor-pointer text-neutral-500 hover:opacity-60" />
          </Link>
          <ThemeButton />
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button className="rounded px-2 text-sm">Sign In</button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  )
}

function ThemeButton() {
  const { setTheme, resolvedTheme } = useTheme()
  const [selected, setSelected] = useState<string | null>(null)
  useEffect(() => {
    if (resolvedTheme) {
      setSelected(resolvedTheme)
    }
  }, [resolvedTheme])

  if (!selected) return null

  const Icon = selected === "dark" ? Moon : SunDim
  return (
    <Button
      className="cursor-pointer text-neutral-500 !outline-0 hover:opacity-60"
      onPress={() => setTheme(selected === "dark" ? "light" : "dark")}
    >
      <Icon size={20} />
    </Button>
  )
}

function WorkModeLink() {
  const { user } = useUser()
  const { data: count } = useCountTask({
    where: {
      ...getWorkModeTasksWhereParam(user?.id),
      done_at: null,
    },
  })
  const hasWorkModeTasks = count && count > 0
  const Icon = hasWorkModeTasks ? Zap : ZapOff
  return (
    <Link href="/work-mode">
      <Icon
        size={16}
        className={twMerge(
          "cursor-pointer hover:opacity-60",
          hasWorkModeTasks ? "text-gold-600" : "text-neutral-400"
        )}
      />
    </Link>
  )
}
