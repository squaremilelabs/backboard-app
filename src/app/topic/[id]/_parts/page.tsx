"use client"

import { Bookmark } from "lucide-react"
import EditableTitle from "@/components/primitives/editable-title"
import { useUpdateTopic } from "@/database/generated/hooks"
import { useTopicData } from "@/lib/data/topic"

export default function TopicPage({ id }: { id: string }) {
  const { data: topic } = useTopicData(id)
  const updateTopic = useUpdateTopic()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <div className="flex h-[30px] items-center text-neutral-500">
          <Bookmark size={24} />
        </div>
        {topic ? (
          <EditableTitle record={topic} updateMutation={updateTopic} className="grow text-xl" />
        ) : null}
      </div>
      <div className="border bg-neutral-100 p-8">Tasks</div>
    </div>
  )
}
