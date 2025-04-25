"use client"
import { twMerge } from "tailwind-merge"
import { sub } from "date-fns"
import CreateInput from "@/components/common/create-input"
import { useCreateTasklist, useFindManyTasklist } from "@/database/generated/hooks"
import TasklistItemContent from "@/components/tasklist/tasklist-item-content"

const sevenDaysAgo = sub(new Date(), { days: 7 })

export default function Tasklists() {
  const createTasklistMutation = useCreateTasklist()

  const { data: tasklists, isLoading: tasklistsIsLoading } = useFindManyTasklist({
    where: { archived_at: null },
    include: {
      tasks: {
        where: {
          OR: [{ completed_at: null }, { completed_at: { gte: sevenDaysAgo } }],
        },
      },
    },
    orderBy: { title: "asc" },
  })

  const handleCreateTasklist = (title: string) => {
    createTasklistMutation.mutate({ data: { title } })
  }

  return (
    <div className={twMerge("h-full w-full", "flex flex-col gap-8")}>
      {tasklistsIsLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {tasklists?.map((tasklist) => {
            return <TasklistItemContent key={tasklist.id} tasklist={tasklist} />
          })}
          <CreateInput
            placeholder="Add Tasklist"
            className="px-8 py-8"
            onSubmit={handleCreateTasklist}
          />
        </>
      )}
    </div>
  )
}
