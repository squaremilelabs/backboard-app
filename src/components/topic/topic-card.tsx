"use client"

import Link from "next/link"
import { twMerge } from "tailwind-merge"
import { usePathname } from "next/navigation"
import { TopicDoneTasksBadge, TopicNextTaskBadge } from "./topic-task-info"
import { TopicListItemData } from "@/lib/topic-utils"

export default function TopicCard({
  topic,
  disableFocusAccent = false,
}: {
  topic: TopicListItemData
  disableFocusAccent?: boolean
}) {
  const pathname = usePathname()
  const isFocused = !disableFocusAccent && pathname.includes(topic.id)

  return (
    <Link href={`/topic/${topic.id}`} scroll={false}>
      <div
        className={twMerge(
          "bg-canvas rounded border",
          "flex flex-col space-y-2 p-4 !outline-0",
          isFocused ? "ring-gold-500 ring-2 focus-visible:ring-offset-2" : "",
          "hover:bg-canvas/50"
        )}
      >
        <div className="flex items-center space-x-2">
          <p className="grow truncate font-medium">{topic.title}</p>
          <TopicNextTaskBadge topic={topic} showEmptyDisplay={!!topic._count_done_tasks} />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <p className="text-sm text-neutral-500">{topic._count_posts} posts</p>
          <TopicDoneTasksBadge topic={topic} />
        </div>
      </div>
    </Link>
  )
}
