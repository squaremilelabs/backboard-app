"use client"

import { useParams, usePathname } from "next/navigation"
import {
  Button,
  Disclosure,
  DisclosurePanel,
  GridList,
  GridListItem,
  Heading,
} from "react-aria-components"
import { ClassNameValue, twMerge } from "tailwind-merge"
import { BookMarked, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useTopicsData } from "@/lib/data/topic"
import CreateByTitleForm from "@/components/create-by-title-form"
import { useCreateTopic } from "@/database/generated/hooks"
import { RELATIVE_TARGETS_UI_ENUM } from "@/lib/constants"

export default function TopicsNav() {
  const [isExpanded, setIsExpanded] = useState(false)
  const createTopic = useCreateTopic()

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col md:hidden">
        <Disclosure
          className="flex flex-col data-expanded:gap-1"
          isExpanded={isExpanded}
          onExpandedChange={setIsExpanded}
        >
          <Heading>
            <Button
              slot="trigger"
              className={twMerge(
                "flex items-center justify-between gap-2 !outline-0",
                isExpanded ? "font-medium" : ""
              )}
            >
              <TopicsNavTitle />
              <ChevronDown
                size={14}
                className={twMerge("transition-transform", isExpanded ? "rotate-180" : "rotate-0")}
              />
            </Button>
          </Heading>
          <DisclosurePanel className="flex flex-col gap-1">
            <TopicsNavList />
            <CreateByTitleForm createMutation={createTopic} placeholder="New Topic" />
          </DisclosurePanel>
        </Disclosure>
      </div>
      <div className="hidden w-full flex-col gap-2 md:flex">
        <TopicsNavTitle className="px-2" />
        <TopicsNavList />
        <CreateByTitleForm createMutation={createTopic} placeholder="New Topic" />
      </div>
    </div>
  )
}

function TopicsNavList() {
  const pathname = usePathname()
  const params = useParams<{ id: string }>()
  const selectedId = pathname.startsWith("/topic/") ? params.id : null
  const { data, isLoading } = useTopicsData({ where: { archived_at: null } })

  return (
    <GridList
      aria-label="My Topics"
      items={data}
      dependencies={[selectedId]}
      renderEmptyState={() => (
        <div className="p-2 text-neutral-500">{isLoading ? "Loading..." : "None"}</div>
      )}
      className={twMerge(
        "w-full divide-y rounded-lg border-2",
        selectedId ? "bg-neutral-100" : "bg-transparent"
      )}
    >
      {(topic) => {
        const noneSelected = selectedId === null
        const isSelected = selectedId === topic.id
        const nextTasklist = topic._computed.next_tasklist
        const nextTasklistUI = nextTasklist ? RELATIVE_TARGETS_UI_ENUM[nextTasklist.target] : null
        return (
          <GridListItem
            textValue={topic.title}
            id={topic.id}
            href={`/topic/${topic.id}`}
            className={twMerge(
              "group flex cursor-pointer items-center gap-2 truncate p-2",
              "first:rounded-t-lg last:rounded-b-lg",
              noneSelected ? "text-neutral-950" : "text-neutral-500",
              isSelected ? "bg-canvas text-neutral-950" : ""
            )}
          >
            <p className="grow truncate group-hover:font-semibold">{topic.title}</p>
            {nextTasklistUI ? (
              <span
                className={twMerge(
                  "size-[16px] min-w-[16px] rounded-full border-2",
                  nextTasklistUI.className
                )}
              />
            ) : null}
          </GridListItem>
        )
      }}
    </GridList>
  )
}

function TopicsNavTitle({ className }: { className?: ClassNameValue }) {
  return (
    <div className={twMerge("flex items-center gap-1 text-sm", className)}>
      <BookMarked size={14} />
      Topics
    </div>
  )
}
