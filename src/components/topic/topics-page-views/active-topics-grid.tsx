"use client"

import { twMerge } from "tailwind-merge"
import { useMemo } from "react"
import { useUser } from "@clerk/nextjs"
import TopicCard from "../topic-card"
import useAside from "@/hooks/useAside"
import { useFindManyTopic } from "@/database/generated/hooks"

export default function ActiveTopicsGrid({
  showOtherUserTopics = false,
}: {
  showOtherUserTopics?: boolean
}) {
  const { user } = useUser()
  const aside = useAside()
  const topicsQuery = useFindManyTopic({
    where: {
      status: "ACTIVE",
    },
    include: {
      created_by: true,
      child_tasks: true,
    },
  })

  const displayedTopics = useMemo(() => {
    if (!topicsQuery.data) return []
    return topicsQuery.data.filter((topic) => {
      if (showOtherUserTopics) return true
      return topic.created_by_id === user?.id
    })
  }, [topicsQuery.data, showOtherUserTopics, user?.id])

  return (
    <div
      className={twMerge("grid", "grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3", "gap-2 @md:gap-3")}
    >
      {displayedTopics.map((topic) => {
        return (
          <TopicCard
            key={topic.id}
            topic={topic}
            href={`/topics?aside=topic:${topic.id}`}
            isFocused={aside.active?.id === topic.id}
          />
        )
      })}
    </div>
  )
}
