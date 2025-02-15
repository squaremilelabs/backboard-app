"use client"

import { Topic } from "@prisma/client"
import { twMerge } from "tailwind-merge"
import { Bookmark } from "lucide-react"
import { useFindManyTopic } from "@/database/generated/hooks"

export function TopicsGrid() {
  const topicsQuery = useFindManyTopic()

  return (
    <div
      className={twMerge(
        "w-full",
        "grid grid-cols-1 gap-2 p-2",
        "@5xl:grid-cols-3 @5xl:gap-4 @5xl:p-4",
        "@2xl:grid-cols-2"
      )}
    >
      {topicsQuery.data?.map((topic) => {
        return <TopicsGridItem key={topic.id} topic={topic} />
      })}
    </div>
  )
}

function TopicsGridItem({ topic }: { topic: Topic }) {
  return (
    <div className={twMerge("rounded border-1 bg-neutral-50 p-2", "grid grid-cols-1 gap-2")}>
      <div className="flex items-center space-x-2 [&_svg]:text-blue-600">
        <Bookmark />
        <p className="grow truncate">{topic.title}</p>
      </div>
    </div>
  )
}
