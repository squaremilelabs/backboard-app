"use client"
import { Prisma } from "@zenstackhq/runtime/models"
import TopicTasklists from "./TopicTasklists"
import EditableText from "@/components/common/EditableText"
import { useFindUniqueTopic, useUpdateTopic } from "@/database/generated/hooks"
import MetadataPopover from "@/components/common/MetadataPopover"

export default function TopicPage({ id }: { id: string }) {
  const { data: topic } = useFindUniqueTopic({ where: { id } })
  const updateTopicMutation = useUpdateTopic()
  const updateTopic = (data: Prisma.TopicUpdateArgs["data"]) => {
    updateTopicMutation.mutate({ where: { id }, data })
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <div className="flex grow px-2">
          {topic ? (
            <EditableText
              initialValue={topic.title}
              onSave={(title) => updateTopic({ title })}
              className="grow text-xl font-medium"
            />
          ) : null}
        </div>
        {topic ? (
          <div className="flex h-[30px] items-center">
            <MetadataPopover
              recordType="Topic"
              record={topic}
              iconSize={20}
              parentIsPublic={false}
              updateMutation={updateTopicMutation}
            />
          </div>
        ) : null}
      </div>
      <div>{topic ? <TopicTasklists topic={topic} /> : null}</div>
    </div>
  )
}
