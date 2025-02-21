"use client"

import { twMerge } from "tailwind-merge"
import { useUser } from "@clerk/nextjs"
import TopicCard from "@/components/topic/topic-card"
import { useTopicsList } from "@/lib/topic-utils"

export default function ActiveTopicsGrid({
  showOtherUserTopics = true,
}: {
  showOtherUserTopics?: boolean
}) {
  const { user } = useUser()
  const { listData } = useTopicsList({
    where: { status: "ACTIVE", created_by_id: showOtherUserTopics ? undefined : user?.id },
  })

  return (
    <div
      className={twMerge("grid", "grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3", "gap-2 @md:gap-3")}
    >
      {listData?.map((topic) => {
        return <TopicCard key={topic.id} topic={topic} />
      })}
    </div>
  )
}
