import { TaskStatus } from "@prisma/client"
import { Task } from "@zenstackhq/runtime/models"

export function getTaskSummary(tasks: Task[]): {
  status: Record<TaskStatus, { count: number; minutes: number }>
  total: { count: number; minutes: number }
} {
  const totalCount = tasks.length
  const totalMinutes = tasks.reduce((sum, task) => sum + (task.size_minutes ?? 0), 0)

  const todoTasks = tasks.filter((task) => task.status === "TODO")
  const todoCount = todoTasks.length
  const todoMinutes = todoTasks.reduce((sum, task) => sum + (task.size_minutes ?? 0), 0)

  const draftTasks = tasks.filter((task) => task.status === "DRAFT")
  const draftCount = draftTasks.length
  const draftMinutes = draftTasks.reduce((sum, task) => sum + (task.size_minutes ?? 0), 0)

  const doneTasks = tasks.filter((task) => task.status === "DONE")
  const doneCount = doneTasks.length
  const doneMinutes = doneTasks.reduce((sum, task) => sum + (task.size_minutes ?? 0), 0)

  return {
    status: {
      DRAFT: { count: draftCount, minutes: draftMinutes },
      TODO: { count: todoCount, minutes: todoMinutes },
      DONE: { count: doneCount, minutes: doneMinutes },
    },
    total: { count: totalCount, minutes: totalMinutes },
  }
}
