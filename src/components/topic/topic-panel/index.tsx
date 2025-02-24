"use client"

import { Bookmark, Loader } from "lucide-react"
import { useFormik } from "formik"
import { Button, Input } from "react-aria-components"
import { TopicStatus } from "@prisma/client"
import DoneTasks from "./done-tasks"
import TopicPosts from "./posts"
import { useTopicItem } from "@/lib/topic/item-data"
import NextTask from "@/components/topic/topic-panel/next-task"
import { useUpdateTopic } from "@/database/generated/hooks"

export default function TopicPanel({ id }: { id: string }) {
  const topicQuery = useTopicItem(id)
  const topic = topicQuery.item

  const updateTopic = useUpdateTopic()
  const formik = useFormik({
    initialValues: {
      title: topic?.title ?? "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateTopic.mutate({
        where: { id },
        data: { title: values.title },
      })
    },
  })

  return (
    <div className="flex w-md max-w-full flex-col gap-4 justify-self-center p-4">
      <form className="flex items-center gap-2 py-4" onSubmit={formik.handleSubmit}>
        {updateTopic.isPending ? (
          <Loader size={24} className="text-gold-600 animate-spin" />
        ) : (
          <Bookmark size={24} className="text-neutral-500" />
        )}
        <Input
          {...formik.getFieldProps("title")}
          className="focus:bg-canvas w-full text-xl font-medium focus:p-2"
          placeholder={topicQuery.isLoading ? "Loading Topic..." : "Topic"}
        />
      </form>
      <div className="flex flex-col gap-4">
        {topic ? <NextTask topic={topic} /> : null}
        {topic?._count_done_tasks ? <DoneTasks topic={topic} /> : null}
        {topic ? <TopicPosts topic={topic} /> : null}
        {topic ? (
          <Button
            className={
              "cursor-pointer self-start px-2 py-1 text-sm text-neutral-500 hover:underline"
            }
            onPress={() => {
              const status: TopicStatus = topic.status === "CLOSED" ? "ACTIVE" : "CLOSED"
              updateTopic.mutate({
                where: { id },
                data: { status: status },
              })
            }}
          >
            {topic.status === "CLOSED" ? "Reopen Topic" : "Close Topic"}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
