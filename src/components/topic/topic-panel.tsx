// E: This is too big of a component. Will refactor later.

"use client"
import { Bookmark, Loader } from "lucide-react"
import { useFormik } from "formik"
import { Input } from "react-aria-components"
import DoneTasks from "../task/done-tasks"
import { useTopicItem } from "@/lib/topic/item-data"
import NextTask from "@/components/task/next-task"
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
          <Bookmark size={24} />
        )}
        <Input
          {...formik.getFieldProps("title")}
          className="focus:bg-canvas w-full text-xl font-medium focus:p-2"
          placeholder="Topic"
        />
      </form>
      <div className="flex flex-col gap-8">
        {topic ? <NextTask topic={topic} /> : null}
        {topic ? <DoneTasks topic={topic} /> : null}
      </div>
    </div>
  )
}
