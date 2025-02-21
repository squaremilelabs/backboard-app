"use client"

import { useFindUniqueTopic } from "@/database/generated/hooks"

export default function TopicPanel({ id }: { id: string }) {
  const topicQuery = useFindUniqueTopic({ where: { id } })
  return (
    <div className="h-[1000px]">
      <h1>{topicQuery?.data?.title}</h1>
      <button>close</button>
    </div>
  )
}
