import { Prisma, Task, Tasklist } from "@prisma/client"
import { useFindManyTasklist, useFindUniqueTasklist } from "@/database/generated/hooks"

export interface TasklistRawResult extends Tasklist {
  tasks: Task[]
  _count: {
    tasks: number
  }
}

export interface TasklistData extends TasklistRawResult {
  _computed: {
    undone_tasks: Task[]
    undone_task_count: number
    done_task_count: number
  }
}

const tasklistDataIncludeParam: Prisma.TasklistInclude = {
  // undone_tasks + undone_task_count
  tasks: {
    where: { archived_at: null, done_at: null },
  },
  // done_task_count
  _count: {
    select: {
      tasks: { where: { archived_at: null, done_at: { not: null } } },
    },
  },
}

function transformTasklistData(tasklistResult: TasklistRawResult): TasklistData {
  return {
    ...tasklistResult,
    _computed: {
      undone_tasks: tasklistResult.tasks,
      undone_task_count: tasklistResult.tasks.length,
      done_task_count: tasklistResult._count.tasks,
    },
  }
}

export type UseTasklistsDataParam = Omit<Parameters<typeof useFindManyTasklist>[0], "include">

export function useTaskslistsData(params: UseTasklistsDataParam = {}) {
  const tasklistsQuery = useFindManyTasklist({
    ...params,
    include: tasklistDataIncludeParam,
  })

  return {
    ...tasklistsQuery,
    data: tasklistsQuery.data?.map(transformTasklistData),
  }
}

export function useTasklistData(id: string) {
  const tasklistQuery = useFindUniqueTasklist({
    where: { id },
    include: tasklistDataIncludeParam,
  })

  const data: TasklistData | null = tasklistQuery.data
    ? transformTasklistData(tasklistQuery.data)
    : null

  return {
    ...tasklistQuery,
    data,
  }
}
