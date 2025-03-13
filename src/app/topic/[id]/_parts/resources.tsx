import { useCreateResource, useFindManyResource } from "@/database/generated/hooks"
import CreateByTitleForm from "@/components/abstract/create-by-title-form"
import { TopicData } from "@/lib/data/topic"
import Resource from "@/components/concrete/resource"

export default function TopicResources({ topic }: { topic: TopicData }) {
  const resourcesQuery = useFindManyResource({
    where: { topic_id: topic.id, archived_at: null },
    orderBy: { updated_at: "desc" },
  })
  const createResource = useCreateResource()
  const resources = resourcesQuery.data
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-2 @sm:grid-cols-2">
        {resources?.map((resource) => (
          <Resource key={resource.id} resource={resource} topic={topic} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 @sm:grid-cols-2">
        <CreateByTitleForm
          createMutation={createResource}
          additionalData={{ topic_id: topic.id, is_public: topic.is_public }}
          placeholder="New Note"
        />
      </div>
    </div>
  )
}
