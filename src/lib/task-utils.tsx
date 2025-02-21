import { Task, TaskTarget } from "@prisma/client"

export const ORDERED_TASK_TARGETS: TaskTarget[] = [
  "TODAY",
  "THIS_WEEK",
  "NEXT_WEEK",
  "THIS_MONTH",
  "NEXT_MONTH",
  "SOMEDAY",
  "NO_TARGET",
]

export function sortUndoneTasks({
  tasks,
  ignoreTopicOrder = false,
}: {
  tasks: Array<Task>
  ignoreTopicOrder?: boolean
}): Array<Task> {
  const result = [...tasks]
  return result.sort((a, b) => {
    if (!ignoreTopicOrder) {
      const aOrderValue = a.parent_topic_order ?? tasks.length + 1
      const bOrderValue = b.parent_topic_order ?? tasks.length + 1

      if (aOrderValue !== bOrderValue) {
        return aOrderValue - bOrderValue
      }
    }

    const aTargetValue = ORDERED_TASK_TARGETS.indexOf(a.target)
    const bTargetValue = ORDERED_TASK_TARGETS.indexOf(b.target)

    if (aTargetValue !== bTargetValue) {
      return aTargetValue - bTargetValue
    }

    const aCreatedValue = a.created_at.getTime()
    const bCreatedValue = b.created_at.getTime()

    return aCreatedValue - bCreatedValue
  })
}
