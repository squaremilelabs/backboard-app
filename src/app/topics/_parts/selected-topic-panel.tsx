"use client"

import { useFindUniqueTopic } from "@/database/generated/hooks"

export default function SelectedTopicPanel({ id }: { id: string }) {
  const topicQuery = useFindUniqueTopic({ where: { id } })
  return <h1>{topicQuery?.data?.title}</h1>
}
