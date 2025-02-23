"use client"

import { Prisma, Task, Topic, User } from "@prisma/client"
import { ORDERED_TASK_DONE_TARGETS } from "../task/constants"
import { useFindManyTopic, useFindUniqueTopic } from "@/database/generated/hooks"

export interface TopicItem extends Topic {
  created_by: User
  _next_task: Task | null
  _last_done_task: Task | null
  _count_done_tasks: number
  _count_posts: number
}

const topicItemIncludeParam: Prisma.TopicInclude = {
  created_by: true,
  current_task: true,
  tasks: {
    where: { done_at: { not: null } },
    orderBy: { done_at: "desc" },
    take: 1,
  },
  _count: {
    select: {
      tasks: { where: { done_at: { not: null } } },
      posts: { where: { is_archived: false } },
    },
  },
}

export function sortTopicItems({ items }: { items: TopicItem[] }): TopicItem[] {
  const result = [...items]
  return result.sort((a, b) => {
    // HAS _next_task (not null)
    if (a._next_task && !b._next_task) return -1
    if (!a._next_task && b._next_task) return 1

    // SOONEST `_next_task.done_target`
    if (a._next_task && b._next_task) {
      const aIndex = ORDERED_TASK_DONE_TARGETS.indexOf(a._next_task.done_target)
      const bIndex = ORDERED_TASK_DONE_TARGETS.indexOf(b._next_task.done_target)
      if (aIndex < bIndex) return -1
      if (aIndex > bIndex) return 1
    }

    // HAS _last_done_task (not null)
    if (a._last_done_task && !b._last_done_task) return -1
    if (!a._last_done_task && b._last_done_task) return 1

    // NEWEST `_last_done_task.done_at` (descending)
    if (a._last_done_task && b._last_done_task) {
      // done_at can never be null (based on where clause) – but adding a fallback for TS
      const aLastDoneAt = a._last_done_task.done_at ?? new Date("1970-01-01")
      const bLastDoneAt = b._last_done_task.done_at ?? new Date("1970-01-01")
      if (aLastDoneAt > bLastDoneAt) return -1
      if (aLastDoneAt < bLastDoneAt) return 1
    }

    // MOST `_count_done_tasks` (descending)
    if (a._count_done_tasks > b._count_done_tasks) return -1
    if (a._count_done_tasks < b._count_done_tasks) return 1

    // MOST `_count_posts` (descending)
    if (a._count_posts > b._count_posts) return -1
    if (a._count_posts < b._count_posts) return 1

    // OLDEST `created_at` (ascending)
    if (a.created_at < b.created_at) return -1
    if (a.created_at > b.created_at) return 1

    return 0
  })
}

export type UseTopicItemsParam = Omit<Parameters<typeof useFindManyTopic>[0], "include">
export function useTopicItems(params: UseTopicItemsParam = {}) {
  const topicsQuery = useFindManyTopic({
    ...params,
    include: topicItemIncludeParam,
  })

  let items: TopicItem[] =
    topicsQuery.data?.map((topic) => {
      let nextTask = null
      if (topic.current_task) {
        if (!topic.current_task.done_at) {
          nextTask = topic.current_task
        }
      }
      return {
        ...topic,
        _next_task: nextTask,
        _last_done_task: topic.tasks[0] || null,
        _count_done_tasks: topic._count.tasks,
        _count_posts: topic._count.posts,
      }
    }) || []

  items = sortTopicItems({ items })

  return {
    ...topicsQuery,
    items,
  }
}

export function useTopicItem(topicId: string) {
  const topicQuery = useFindUniqueTopic({
    where: { id: topicId },
    include: topicItemIncludeParam,
  })

  let item: TopicItem | null = null

  if (topicQuery.data) {
    const topic = topicQuery.data
    let nextTask = null
    if (topic.current_task) {
      if (!topic.current_task.done_at) {
        nextTask = topic.current_task
      }
    }
    item = {
      ...topic,
      _next_task: nextTask,
      _last_done_task: topic.tasks[0] || null,
      _count_done_tasks: topic._count.tasks,
      _count_posts: topic._count.posts,
    }
  }

  return {
    ...topicQuery,
    item,
  }
}
