"use client"

import { Prisma, Tasklist, Topic } from "@prisma/client"
import { RELATIVE_TARGETS_ORDER } from "../constants"
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

export function sortTopics(topics: TopicData[]) {
  return [...topics].sort((a, b) => {
    // Has tasklist
    const aTasklist = a._computed.next_tasklist
    const bTasklist = b._computed.next_tasklist
    if (aTasklist && !bTasklist) return -1
    if (!aTasklist && bTasklist) return 1
    // Tasklist with earlier target
    if (aTasklist && bTasklist) {
      const aTasklistTargetIndex = RELATIVE_TARGETS_ORDER.indexOf(aTasklist.target)
      const bTasklistTargetIndex = RELATIVE_TARGETS_ORDER.indexOf(bTasklist.target)
      if (aTasklistTargetIndex < bTasklistTargetIndex) return -1
      if (aTasklistTargetIndex > bTasklistTargetIndex) return 1
    }
    // Undone task count
    const aUndoneTaskCount = a._computed.undone_task_count
    const bUndoneTaskCount = b._computed.undone_task_count
    if (aUndoneTaskCount > bUndoneTaskCount) return -1
    if (aUndoneTaskCount < bUndoneTaskCount) return 1
    // Created at
    if (a.created_at < b.created_at) return -1
    if (a.created_at > b.created_at) return 1
    return 0
  })
}

export type UseTopicsDataParam = Omit<Parameters<typeof useFindManyTopic>[0], "include">

export function useTopicsData(params: UseTopicsDataParam = {}) {
  const topicsQuery = useFindManyTopic({
    ...params,
    include: topicDataIncludeParam,
  })

  let data: TopicData[] =
    topicsQuery.data?.map((topic) => {
      return transformTopicData(topic)
    }) || []

  data = sortTopics(data)

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
