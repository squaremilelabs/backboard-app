"use client"

import { twMerge } from "tailwind-merge"
import TopicCard from "../topic-card"
import { useFindManyTopic } from "@/database/generated/hooks"
import useAside from "@/hooks/useAside"

export default function TopicsPanel() {
  const aside = useAside()
  const topicsQuery = useFindManyTopic({
    include: {
      created_by: true,
      child_tasks: true,
    },
  })
  return (
    <div className="flex w-full flex-col justify-self-center">
      <div className="flex w-full items-center justify-between p-4 @md:p-8">
        <h1 className="text-xl font-medium">Topics</h1>
      </div>
      <div
        className={twMerge(
          "grid",
          "grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3",
          "gap-2 @sm:gap-3",
          "px-2 @sm:px-4"
        )}
      >
        {topicsQuery?.data?.map((topic) => {
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
    </div>
  )
}
