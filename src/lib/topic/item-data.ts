"use client"

import { Prisma, Task, Topic, User } from "@prisma/client"
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

export type UseTopicItemsParam = Omit<Parameters<typeof useFindManyTopic>[0], "include">
export function useTopicItems(params: UseTopicItemsParam = {}) {
  const topicsQuery = useFindManyTopic({
    ...params,
    include: topicItemIncludeParam,
  })

  const items: TopicItem[] | undefined = topicsQuery.data?.map((topic) => {
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
  })

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

  let item: TopicItem | undefined

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
