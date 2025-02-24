"use client"

import TopicsGridList from "./topics-grid-list"
import { useTopicItems } from "@/lib/topic/item-data"

export default function ClosedTopics() {
  const { items, isLoading } = useTopicItems({
    where: { status: "CLOSED" },
  })

  return <TopicsGridList topics={items} isLoading={isLoading} />
}
