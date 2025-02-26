"use client"

import { Prisma, Tasklist, Topic } from "@prisma/client"
import { useFindManyTopic, useFindUniqueTopic } from "@/database/generated/hooks"

export interface TopicRawResult extends Topic {
  tasklists: Tasklist[]
  _count: {
    tasklists: number
    resources: number
    tasks: number
  }
}

export interface TopicData extends TopicRawResult {
  _computed: {
    next_tasklist: Tasklist | null
    tasklist_count: number
    resource_count: number
    undone_task_count: number
  }
}

const topicDataIncludeParam: Prisma.TopicInclude = {
  // next_tasklist
  tasklists: {
    where: { archived_at: null },
    orderBy: { target: "asc" },
    take: 1,
  },
  _count: {
    select: {
      // tasklist_count
      tasklists: { where: { archived_at: null } },
      // resource_count
      resources: { where: { archived_at: null } },
      // task_count
      tasks: { where: { archived_at: null, done_at: null } },
    },
  },
}

function transformTopicData(topicResult: TopicRawResult): TopicData {
  return {
    ...topicResult,
    _computed: {
      next_tasklist: topicResult.tasklists[0] || null,
      tasklist_count: topicResult._count.tasklists,
      resource_count: topicResult._count.resources,
      undone_task_count: topicResult._count.tasks,
    },
  }
}

export type UseTopicsDataParam = Omit<Parameters<typeof useFindManyTopic>[0], "include">

export function useTopicsData(params: UseTopicsDataParam = {}) {
  const topicsQuery = useFindManyTopic({
    ...params,
    include: topicDataIncludeParam,
  })

  const data: TopicData[] =
    topicsQuery.data?.map((topic) => {
      return transformTopicData(topic)
    }) || []

  return {
    ...topicsQuery,
    data,
  }
}

export function useTopicData(id: string) {
  const topicQuery = useFindUniqueTopic({ where: { id }, include: topicDataIncludeParam })

  const data: TopicData | null = topicQuery.data ? transformTopicData(topicQuery.data) : null

  return {
    ...topicQuery,
    data,
  }
}
