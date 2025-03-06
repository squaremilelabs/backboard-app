"use client"

import { Bookmark, Text } from "lucide-react"
import TopicTasklists from "./tasklists"
import TopicResources from "./resources"
import EditableText from "@/components/abstract/editable-text"
import { useUpdateTopic } from "@/database/generated/hooks"
import { useTopicData } from "@/lib/data/topic"
import MetadataPopover from "@/components/abstract/metadata-popover"

export default function TopicPage({ id }: { id: string }) {
  const { data: topic } = useTopicData(id)
  const updateTopic = useUpdateTopic()

  return (
    <div className="flex flex-col gap-8">
      {/* Title & Description */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="flex h-[30px] items-center gap-2">
            <Bookmark size={24} />
          </div>
          <div className="flex grow">
            {topic ? (
              <EditableText
                record={topic}
                updateMutation={updateTopic}
                className="grow text-xl font-medium"
              />
            ) : null}
          </div>
          <div className="flex h-[30px] items-center">
            <MetadataPopover
              recordType="Topic"
              record={topic}
              iconSize={20}
              parentIsPublic={false}
              updateMutation={updateTopic}
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex h-[20px] w-[24px] items-center justify-center text-neutral-500">
            <Text size={16} />
          </div>
          <EditableText
            record={topic}
            updateMutation={updateTopic}
            updateField="description"
            placeholder="About this topic..."
          />
        </div>
      </div>
      <div>
        <SectionTitle title="Tasklists" />
        {topic ? <TopicTasklists topic={topic} /> : null}
      </div>
      <div>
        <SectionTitle title="Notes" />
        {topic ? <TopicResources topic={topic} /> : null}
      </div>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 border-b px-2 py-4 font-medium text-neutral-500">
      <h1 className="text-base">{title}</h1>
    </div>
  )
}
