"use client"

import { Button } from "react-aria-components"
import { useFindUniqueTopic } from "@/database/generated/hooks"
import useAside from "@/hooks/useAside"

export default function TopicPanel({ id }: { id: string }) {
  const topicQuery = useFindUniqueTopic({ where: { id } })
  const topic = topicQuery.data

  const { closeAside } = useAside()

  if (!topic) return null
  return (
    <div className="grid w-full grid-rows-[auto_1fr]">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-lg">{topic.title}</h1>
        <Button onPress={closeAside}>Close</Button>
      </div>
    </div>
  )
}
