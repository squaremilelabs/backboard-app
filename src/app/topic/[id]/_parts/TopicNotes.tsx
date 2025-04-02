import { useCreateNote, useFindManyNote } from "@/database/generated/hooks"
import CreateByTitleLine from "@/components/common/CreateByTitleLine"
import { TopicData } from "@/lib/topic"
import Note from "@/components/resource/Note"

export default function TopicNotes({ topic }: { topic: TopicData }) {
  const resourcesQuery = useFindManyNote({
    where: { topic_id: topic.id, archived_at: null },
    orderBy: { updated_at: "desc" },
  })
  const createNote = useCreateNote()
  const notes = resourcesQuery.data
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-2 @sm:grid-cols-2">
        {notes?.map((note) => <Note key={note.id} note={note} topic={topic} />)}
      </div>
      <div className="grid grid-cols-1 gap-2 @sm:grid-cols-2">
        <CreateByTitleLine
          createMutation={createNote}
          additionalData={{ topic_id: topic.id, is_public: topic.is_public }}
          placeholder="New Note"
        />
      </div>
    </div>
  )
}
