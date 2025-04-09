"use client"

// E: To refactor (implemented drag & drop haphazardly)

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
import { BookMarked, ChevronDown, GripVertical, Share2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Topic } from "@prisma/client"
import { User } from "@zenstackhq/runtime/models"
import CreateByTitleLine from "@/components/common/CreateByTitleLine"
import {
  useCreateTopic,
  useFindManyTopic,
  useFindUniqueUser,
  useUpdateUser,
} from "@/database/generated/hooks"
import useDragAndDropList from "@/hooks/useDragAndDropList"
import TaskIndicator from "@/components/task/TaskIndicator"

export default function TopicsNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const { user: authUser } = useUser()
  const userQuery = useFindUniqueUser({
    where: { id: authUser?.id ?? "NO_USER" },
  })
  const topicsQuery = useFindManyTopic({
    where: { archived_at: null, created_by_id: authUser?.id ?? "NO_USER" },
  })

  const isLoaded = userQuery.data && topicsQuery.data
  const createTopic = useCreateTopic()

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
              {isLoaded ? (
                <>
                  <TopicsNavList user={userQuery.data} topics={topicsQuery.data} />
                  <CreateByTitleLine
                    createMutation={createTopic}
                    placeholder="New Topic"
                    className="border-2"
                  />
                </>
              ) : null}
            </Dialog>
          </Popover>
        </DialogTrigger>
      </div>
      <div className="hidden w-full flex-col gap-2 md:flex">
        {isLoaded ? (
          <>
            <TopicsNavList user={userQuery.data} topics={topicsQuery.data} />
            <CreateByTitleLine createMutation={createTopic} placeholder="New Topic" />
          </>
        ) : null}
      </div>
    </div>
  )
}

function TopicsNavList({ user, topics }: { user: User; topics: Topic[] }) {
  const pathname = usePathname()
  const params = useParams<{ id: string }>()
  const selectedId = pathname.startsWith("/topic/") ? params.id : null

  const updateUser = useUpdateUser()

  const { dragAndDropHooks, list } = useDragAndDropList({
    itemType: "topic",
    items: topics,
    savedOrder: user.topic_order,
    handleOrderChange: (newOrder) => {
      updateUser.mutate({
        where: { id: user.id },
        data: { topic_order: newOrder },
      })
    },
  })

  return (
    <GridList
      aria-label="My Topics"
      items={list.items}
      dependencies={[selectedId]}
      dragAndDropHooks={dragAndDropHooks}
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
            <Button
              slot="drag"
              className="focus-visible:text-gold-500 cursor-grab text-neutral-500 !outline-0"
            >
              <GripVertical size={16} />
            </Button>
            <p className="grow truncate group-hover:font-semibold">{topic.title}</p>
            {topic.is_public ? <Share2 size={14} className="text-neutral-500" /> : null}
            <TaskIndicator size="sm" whereClause={{ topic_id: topic.id }} />
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
