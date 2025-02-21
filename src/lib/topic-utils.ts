"use client"

import { Prisma, Task, Topic, User } from "@prisma/client"
import { useFindManyTopic, useFindUniqueTopic } from "@/database/generated/hooks"

export interface TopicListItemData extends Topic {
  created_by: User
  _next_task: Task | null
  _last_done_task: Task | null
  _count_done_tasks: number
  _count_posts: number
}

const topicListItemIncludeParam: Prisma.TopicInclude = {
  created_by: true,
  current_task: true,
  tasks: {
    where: { is_done: true },
    orderBy: { done_at: "desc" },
    take: 1,
  },
  _count: {
    select: {
      tasks: { where: { is_done: true } },
      posts: { where: { is_archived: false } },
    },
  },
}

export function useTopicsList(
  params: Omit<Parameters<typeof useFindManyTopic>[0], "include"> = {}
) {
  const topicsQuery = useFindManyTopic({
    ...params,
    include: topicListItemIncludeParam,
  })

  const listData: TopicListItemData[] | undefined = topicsQuery.data?.map((topic) => {
    let nextTask = null
    if (topic.current_task) {
      if (!topic.current_task.is_done) {
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
    listData,
  }
}

export function useTopicsListItem(topicId: string) {
  const topicQuery = useFindUniqueTopic({
    where: { id: topicId },
    include: topicListItemIncludeParam,
  })

  let itemData: TopicListItemData | undefined
  if (topicQuery.data) {
    const topic = topicQuery.data
    let nextTask = null
    if (topic.current_task) {
      if (!topic.current_task.is_done) {
        nextTask = topic.current_task
      }
    }
    itemData = {
      ...topic,
      _next_task: nextTask,
      _last_done_task: topic.tasks[0] || null,
      _count_done_tasks: topic._count.tasks,
      _count_posts: topic._count.posts,
    }
  }
  return {
    ...topicQuery,
    itemData,
  }
}
