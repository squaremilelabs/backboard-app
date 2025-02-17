"use client"

import { twMerge } from "tailwind-merge"
import TopicCard from "../topic-card"
import { useFindManyTopic } from "@/database/generated/hooks"
import useAside from "@/hooks/useAside"

export default function TopicsPanel() {
  const aside = useAside()
  const topicsQuery = useFindManyTopic()
  return (
    <div className="flex w-full flex-col justify-self-center">
      <div className="flex w-full items-center justify-between p-4">
        <h1 className="text-lg font-medium">Topics</h1>
      </div>
      <div
        className={twMerge(
          "w-full",
          "grid content-start gap-2 px-2 @md:gap-4",
          "grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3"
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
