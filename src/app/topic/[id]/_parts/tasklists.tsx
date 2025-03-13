import CreateByTitleForm from "@/components/abstract/create-by-title-form"
import { useCreateTasklist } from "@/database/generated/hooks"
import { useTaskslistsData } from "@/lib/data/tasklist"
import { TopicData } from "@/lib/data/topic"
import Tasklist from "@/components/concrete/tasklist"

export default function TopicTasklists({ topic }: { topic: TopicData }) {
  const { data: tasklists } = useTaskslistsData({
    where: { topic_id: topic.id, archived_at: null },
    orderBy: [{ target: "asc" }, { created_at: "desc" }],
  })
  const createTasklist = useCreateTasklist()
  return (
    <div className="flex flex-col gap-2">
      {tasklists?.map((tasklist) => (
        <Tasklist key={tasklist.id} tasklist={tasklist} topic={topic} />
      ))}
      <CreateByTitleForm
        createMutation={createTasklist}
        additionalData={{ topic_id: topic.id, is_public: topic.is_public }}
        placeholder="New Tasklist"
      />
    </div>
  )
}
