"use client"

// E: not a good component lol

import { Archive } from "lucide-react"
import { Button } from "react-aria-components"
import { Prisma } from "@prisma/client"
import { subDays } from "date-fns"
import { useMemo } from "react"
import {
  useFindManyResource,
  useFindManyTask,
  useFindManyTasklist,
  useFindManyTopic,
  useUpdateResource,
  useUpdateTask,
  useUpdateTasklist,
  useUpdateTopic,
} from "@/database/generated/hooks"
import { formatDate } from "@/lib/utils"

export default function ArchivePage() {
  const queryParam = useMemo(
    () => ({
      where: { archived_at: { gte: subDays(new Date(), 14), not: null } },
      orderBy: { archived_at: "desc" },
    }),
    []
  )

  const topicsQuery = useFindManyTopic(queryParam as Prisma.TopicFindManyArgs)
  const updateTopic = useUpdateTopic()

  const resourcesQuery = useFindManyResource(queryParam as Prisma.ResourceFindManyArgs)
  const updateResource = useUpdateResource()

  const tasklistsQuery = useFindManyTasklist(queryParam as Prisma.TasklistFindManyArgs)
  const updateTasklist = useUpdateTasklist()

  const tasksQuery = useFindManyTask(queryParam as Prisma.TaskFindManyArgs)
  const updateTask = useUpdateTask()

  const sections = [
    { title: "Archived Topics", query: topicsQuery, update: updateTopic },
    { title: "Archived Resources", query: resourcesQuery, update: updateResource },
    { title: "Archived Tasklists", query: tasklistsQuery, update: updateTasklist },
    { title: "Archived Tasks", query: tasksQuery, update: updateTask },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-neutral flex items-center gap-2 text-neutral-500">
          <Archive size={24} />
          <h1 className="text-xl font-medium">Archive</h1>
        </div>
        <p className="text-neutral-500">Items archived in the past 14 days</p>
      </div>
      {sections.map((section) => {
        return (
          <div key={section.title} className="flex flex-col gap-2">
            <h2 className="border-default-300 border-b-2 px-2 py-2 font-medium">{section.title}</h2>
            <div className="flex flex-col gap-1">
              {section.query.isLoading ? <p className="px-2">Loading...</p> : null}
              {section.query.data && !section.query.data.length ? (
                <p className="px-2">None</p>
              ) : null}
              {section.query.data?.map((item) => {
                const handleRestore = () => {
                  section.update.mutate({
                    where: { id: item.id },
                    data: { archived_at: null },
                  })
                }
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded border bg-neutral-100 p-2"
                  >
                    <p>{item.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-neutral-500">
                        Archived {formatDate(item.archived_at, { withTime: true })}
                      </p>
                      <Button
                        onPress={handleRestore}
                        className="rounded bg-neutral-400 px-2 py-1 text-neutral-50"
                      >
                        Restore
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
