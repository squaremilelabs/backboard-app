import { Topic } from "@zenstackhq/runtime/models"
import CreateByTitleLine from "@/components/common/CreateByTitleLine"
import { useCreateTasklist, useFindManyTasklist } from "@/database/generated/hooks"
import Tasklist from "@/components/task/Tasklist"

export default function TopicTasklists({ topic }: { topic: Topic }) {
  const { data: tasklists } = useFindManyTasklist({
    where: { topic_id: topic.id, archived_at: null },
    orderBy: [{ created_at: "desc" }],
  })
  const createTasklist = useCreateTasklist()
  return (
    <div className="flex flex-col gap-2">
      {tasklists?.map((tasklist) => (
        <Tasklist key={tasklist.id} tasklist={tasklist} topic={topic} />
      ))}
      <CreateByTitleLine
        createMutation={createTasklist}
        additionalData={{ topic_id: topic.id, is_public: topic.is_public }}
        placeholder="New Tasklist"
      />
    </div>
  )
}
