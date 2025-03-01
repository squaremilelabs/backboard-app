import { Prisma, Task, Tasklist, Topic } from "@prisma/client"
import { startOfDay } from "date-fns"
import { useFindManyTask } from "@/database/generated/hooks"

export interface TaskRawResult extends Task {
  topic: Topic
  tasklist: Tasklist
}

export interface TaskData extends TaskRawResult {
  _computed: {
    topic_title: string
    tasklist_title: string
    order_in_tasklist: number | null
  }
}

const taskDataIncludeParam: Prisma.TaskInclude = {
  tasklist: true,
  topic: true,
}

function transformTaskData(taskResult: TaskRawResult): TaskData {
  return {
    ...taskResult,
    _computed: {
      topic_title: taskResult.topic.title,
      tasklist_title: taskResult.tasklist.title,
      order_in_tasklist: taskResult.tasklist.task_order
        ? taskResult.tasklist.task_order.indexOf(taskResult.id)
        : null,
    },
  }
}

export function getWorkModeTasksWhereParam(
  userId: string | null | undefined
): Prisma.TaskWhereInput {
  const today = startOfDay(new Date())
  return {
    created_by_id: userId ?? "NO_RESULTS",
    OR: [
      { done_at: null, tasklist: { target: { in: ["TODAY", "THIS_WEEK"] } } },
      { done_at: { gte: today } },
    ],
    topic: { archived_at: null },
    tasklist: { archived_at: null },
    archived_at: null,
  }
}

export type UseTasksDataParam = Omit<Parameters<typeof useFindManyTask>[0], "include">

export function useTasksData(params: UseTasksDataParam) {
  const tasksQuery = useFindManyTask({
    ...params,
    include: taskDataIncludeParam,
  })

  const data: TaskData[] = tasksQuery.data?.map(transformTaskData) || []

  return {
    ...tasksQuery,
    data,
  }
}
