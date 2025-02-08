"use client"

import { ChevronDown, LucideIcon } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import {
  Button,
  Dialog,
  DialogTrigger,
  Key,
  Popover,
  Tab,
  TabList,
  Tabs,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"

type NavItemProps = {
  hrefOrId: string
  title: string
  Icon?: LucideIcon
  endContent?: React.ReactNode
}

type NavBaseProps = {
  type: "links" | "buttons"
  size?: "sm" | "md" | "lg"
  color: "canvas" | "neutral"
}

type NavLinksProps = NavBaseProps & {
  type: "links"
  retainPanelParam?: boolean
  items: NavItemProps[]
}

type NavButtonsProps = NavBaseProps & {
  type: "buttons"
  selectedId: string
  onSelectionChange: (id: Key) => void
  items: NavItemProps[]
}

type NavProps = NavLinksProps | NavButtonsProps

function useSelectedNavItem(props: NavProps): NavItemProps | null {
  const { type, items } = props
  const pathname = usePathname()
  const selectedHrefOrId = type === "buttons" ? props.selectedId : pathname
  return useMemo(
    () =>
      items.find((item) => {
        if (type === "links") {
          return selectedHrefOrId.startsWith(item.hrefOrId)
        } else {
          return item.hrefOrId === selectedHrefOrId
        }
      }) ?? null,
    [type, selectedHrefOrId, items]
  )
}

export function Nav(props: NavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedNavItem = useSelectedNavItem(props)
  return (
    <div className="w-full">
      <div
        className={twMerge(
          "hidden w-full",
          props.size === "sm" ? "@sm:grid" : props.size === "md" ? "@xl:grid" : "@4xl:grid"
        )}
      >
        <NavItems mode="tabs" {...props} />
      </div>
      <div
        className={twMerge(
          "grid",
          props.size === "sm" ? "@sm:hidden" : props.size === "md" ? "@xl:hidden" : "@4xl:hidden"
        )}
      >
        <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
          <Button
            className={twMerge(
              "rounded border-2 border-transparent",
              "text-neutral-900",
              "hover:opacity-80",
              "data-pressed:scale-99 data-pressed:px-1",
              "cursor-pointer",
              "grid grid-cols-[1fr_auto] items-center gap-1",

              props.color === "canvas" ? "data-pressed:bg-canvas" : "data-pressed:bg-neutral-100"
            )}
          >
            <NavItemContent item={selectedNavItem} navProps={props} />
            <ChevronDown size={20} />
          </Button>
          <Popover placement="bottom start">
            <Dialog className={twMerge("bg-canvas")}>
              <NavItems mode="dialog" setIsOpen={setIsOpen} {...props} />
            </Dialog>
          </Popover>
        </DialogTrigger>
      </div>
    </div>
  )
}

function NavItems({
  mode,
  setIsOpen,
  ...navProps
}: NavProps & { mode: "tabs" | "dialog"; setIsOpen?: (isOpen: boolean) => void }) {
  const selectedNavItem = useSelectedNavItem(navProps)
  const searchParams = useSearchParams()
  const panelParam = searchParams.get("panel")

  const handleSelectionChange = (id: Key) => {
    if (!selectedNavItem) return
    if (setIsOpen) {
      setIsOpen(false)
    }
    if (navProps.type === "buttons") {
      navProps.onSelectionChange(id)
    }
  }

  return (
    <Tabs
      selectedKey={selectedNavItem?.hrefOrId ?? null}
      onSelectionChange={handleSelectionChange}
      orientation={mode === "tabs" ? "horizontal" : "vertical"}
      keyboardActivation="manual"
    >
      <TabList className={twMerge(mode === "tabs" ? "grid grid-flow-col gap-2" : "grid gap-2")}>
        {navProps.items.map((item) => {
          let href = undefined
          if (navProps.type === "links") {
            if (navProps.retainPanelParam) {
              href = item.hrefOrId + (panelParam ? `?panel=${panelParam}` : "")
            } else {
              href = item.hrefOrId
            }
          }
          return (
            <Tab
              key={item.hrefOrId}
              id={item.hrefOrId}
              aria-label={item.title}
              href={href}
              className={twMerge(
                "rounded border-2 px-2 py-1",
                "text-neutral-400",
                navProps.color === "canvas"
                  ? "data-selected:bg-canvas data-selected:text-neutral-900"
                  : `border-neutral-100 data-selected:border-neutral-200 data-selected:bg-neutral-100
                    data-selected:text-neutral-900`,
                "hover:opacity-80",
                "data-pressed:scale-99",
                mode === "dialog" ? "min-w-2xs" : null
              )}
            >
              <NavItemContent item={item} navProps={navProps} />
            </Tab>
          )
        })}
      </TabList>
    </Tabs>
  )
}

function NavItemContent({ item }: { item: NavItemProps | null; navProps: NavProps }) {
  return (
    <div>
      <div className={twMerge("flex items-center space-x-1")}>
        {item?.Icon && <item.Icon size={20} />}
        <span>{item?.title ?? "Go to..."}</span>
      </div>
      <div>{item?.endContent ?? null}</div>
    </div>
  )
}
