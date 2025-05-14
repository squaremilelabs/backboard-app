import { Task, Tasklist } from "@zenstackhq/runtime/models"
import { getTaskSummary } from "./utils-task"

export const defaultTasklistEmojiCode = "1f4cb" // Default emoji code for tasklist

export function sortTasklists<T extends Tasklist & { tasks: Task[] }>(tasklists: T[]): T[] {
  return tasklists.sort((a, b) => {
    const aTasksSummary = getTaskSummary(a.tasks)
    const bTasksSummary = getTaskSummary(b.tasks)
    const aTodoMinutes = aTasksSummary.status.TODO.minutes
    const bTodoMinutes = bTasksSummary.status.TODO.minutes
    const aDraftMinutes = aTasksSummary.status.DRAFT.minutes
    const bDraftMinutes = bTasksSummary.status.DRAFT.minutes
    const aDoneMinutes = aTasksSummary.status.DONE.minutes
    const bDoneMinutes = bTasksSummary.status.DONE.minutes

    // Compare by TODO minutes in descending order
    if (bTodoMinutes !== aTodoMinutes) {
      return bTodoMinutes - aTodoMinutes
    }

    // Compare by DRAFT minutes in descending order
    if (bDraftMinutes !== aDraftMinutes) {
      return bDraftMinutes - aDraftMinutes
    }

    // Compare by DONE minutes in descending order
    if (bDoneMinutes !== aDoneMinutes) {
      return bDoneMinutes - aDoneMinutes
    }

    // Fallback to comparing by created_at in ascending order
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
}
