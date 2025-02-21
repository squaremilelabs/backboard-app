"use client"

import { Task, Topic, User } from "@prisma/client"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import { useUser } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { TopicTaskCountBadge, TopicTaskTemporalBadge } from "./topic-task-info"
import { formatDate } from "@/lib/utils"

interface TopicCardTopic extends Topic {
  created_by: User
  child_tasks: Array<Task>
}

export default function TopicCard({
  topic,
  disableFocusAccent = false,
}: {
  topic: TopicCardTopic
  disableFocusAccent?: boolean
}) {
  const pathname = usePathname()
  const { user } = useUser()
  const otherOwnerName = user?.id === topic.created_by_id ? null : topic.created_by.display_name
  const isFocused = !disableFocusAccent && pathname.includes(topic.id)

  return (
    <Link href={`/topics/id/${topic.id}`} scroll={false}>
      <div
        className={twMerge(
          "bg-canvas rounded border",
          "flex flex-col space-y-2 p-4",
          isFocused ? "ring-1 ring-blue-500 focus-visible:ring-2" : "",
          "hover:bg-canvas/50"
        )}
      >
        <div className="flex items-center space-x-2">
          <p className="grow truncate font-medium">{topic.title}</p>
          <TopicTaskTemporalBadge topic={topic} />
          <TopicTaskCountBadge topic={topic} />
        </div>
        <div className="flex items-center space-x-2">
          {otherOwnerName ? <p className="text-sm text-blue-600">{otherOwnerName}</p> : null}
          <p className="text-sm text-neutral-500">{formatDate(topic.created_at)}</p>
        </div>
      </div>
    </Link>
  )
}
