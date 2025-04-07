"use client"

import { useParams, usePathname } from "next/navigation"
import {
  Button,
  Dialog,
  DialogTrigger,
  GridList,
  GridListItem,
  Popover,
} from "react-aria-components"
import { ClassNameValue, twMerge } from "tailwind-merge"
import { BookMarked, ChevronDown, Share2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import CreateByTitleLine from "@/components/common/CreateByTitleLine"
import { useCreateTopic, useFindManyTopic } from "@/database/generated/hooks"

export default function TopicsNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const createTopic = useCreateTopic()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-fit flex-col md:hidden">
        <DialogTrigger>
          <Button
            onPress={() => setIsOpen((prev) => !prev)}
            className={twMerge(
              "flex items-center justify-between gap-2 rounded-lg border bg-neutral-100 px-2 py-1 !outline-0",
              isOpen ? "border-2 border-neutral-300 font-medium" : ""
            )}
          >
            <TopicsNavTitle />
            <ChevronDown
              size={14}
              className={twMerge("transition-transform", isOpen ? "rotate-180" : "rotate-0")}
            />
          </Button>
          <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
            <Dialog
              className="flex w-[80dvw] max-w-[360px] flex-col gap-1 rounded-lg border-2 border-neutral-300 bg-neutral-100/50
                p-1 !outline-0 backdrop-blur-xl"
            >
              <TopicsNavList />
              <CreateByTitleLine
                createMutation={createTopic}
                placeholder="New Topic"
                className="border-2"
              />
            </Dialog>
          </Popover>
        </DialogTrigger>
      </div>
      <div className="hidden w-full flex-col gap-2 md:flex">
        <TopicsNavTitle className="px-2" />
        <TopicsNavList />
        <CreateByTitleLine createMutation={createTopic} placeholder="New Topic" />
      </div>
    </div>
  )
}

function TopicsNavList() {
  const pathname = usePathname()
  const params = useParams<{ id: string }>()
  const selectedId = pathname.startsWith("/topic/") ? params.id : null
  const { user } = useUser()
  const { data, isLoading } = useFindManyTopic({
    where: { archived_at: null, created_by_id: user?.id ?? "NO_USER" },
    orderBy: { title: "asc" },
  })

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
        return (
          <GridListItem
            textValue={topic.title}
            id={topic.id}
            href={`/topic/${topic.id}`}
            className={twMerge(
              "group flex cursor-pointer items-center gap-1 truncate p-2",
              "first:rounded-t-lg last:rounded-b-lg",
              noneSelected ? "text-neutral-950" : "text-neutral-500",
              isSelected ? "bg-canvas text-neutral-950" : ""
            )}
          >
            <p className="grow truncate group-hover:font-semibold">{topic.title}</p>
            {topic.is_public ? <Share2 size={14} className="text-neutral-500" /> : null}
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
      My Topics
    </div>
  )
}
