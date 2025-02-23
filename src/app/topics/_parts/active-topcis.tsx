"use client"
import { useUser } from "@clerk/nextjs"
import { Loader, Plus } from "lucide-react"
import { Input } from "react-aria-components"
import { useFormik } from "formik"
import TopicsGridList from "./topics-grid-list"
import { useTopicItems } from "@/lib/topic/item-data"
import { useCreateTopic } from "@/database/generated/hooks"

export default function ActiveTopics({
  showOtherUserTopics = true,
}: {
  showOtherUserTopics?: boolean
}) {
  const { user } = useUser()
  const { items, isLoading } = useTopicItems({
    where: { status: "ACTIVE", created_by_id: showOtherUserTopics ? undefined : user?.id },
  })

  const createTopic = useCreateTopic({ onSuccess: () => formik.resetForm() })
  const formik = useFormik({
    initialValues: {
      title: "",
    },
    onSubmit: (values) => {
      createTopic.mutate({
        data: { title: values.title },
      })
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <TopicsGridList topics={items} isLoading={isLoading} />
      <form
        className="focus-within:bg-canvas border-gold-500 flex items-center gap-2 rounded p-4 focus-within:border-2"
        onSubmit={formik.handleSubmit}
      >
        {createTopic.isPending ? (
          <Loader size={20} className="text-gold-500 animate-spin" />
        ) : (
          <Plus size={20} />
        )}
        <Input
          {...formik.getFieldProps("title")}
          placeholder="Add Topic"
          className={"w-full !ring-0 !outline-0"}
        />
      </form>
    </div>
  )
}
