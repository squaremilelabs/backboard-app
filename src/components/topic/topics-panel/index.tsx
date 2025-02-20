"use client"

import { twMerge } from "tailwind-merge"
import { useEffect } from "react"
import { useFormik } from "formik"
import { CircleAlert, Loader, Plus } from "lucide-react"
import TopicCard from "../topic-card"
import { useCreateTopic, useFindManyTopic } from "@/database/generated/hooks"
import useAside from "@/hooks/useAside"

export default function TopicsPanel() {
  const aside = useAside()
  const topicsQuery = useFindManyTopic({
    include: {
      tasks: true,
    },
  })
  return (
    <div className="flex w-full flex-col justify-self-center">
      <div className="flex w-full items-center justify-between p-4 @md:p-8">
        <h1 className="text-xl font-medium">Topics</h1>
      </div>
      <div
        className={twMerge("flex w-full flex-col", "space-y-2 px-2 pb-40 @md:space-y-3 @md:px-4")}
      >
        {topicsQuery?.data?.map((topic) => {
          return (
            <TopicCard
              key={topic.id}
              topic={topic}
              href={`/topics?aside=topic:${topic.id}`}
              isFocused={aside.active?.id === topic.id}
            />
          )
        })}
        <TopicCreateBox />
      </div>
    </div>
  )
}

function TopicCreateBox() {
  const createMutation = useCreateTopic()
  const formik = useFormik({
    initialValues: {
      title: "",
    },
    onSubmit: (values) => {
      createMutation.mutate({ data: { title: values.title } })
    },
  })

  useEffect(() => {
    if (createMutation.isSuccess) {
      formik.resetForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- max depth error when adding formik as a dependency
  }, [createMutation.isSuccess])

  useEffect(() => {
    if (createMutation.isError) {
      createMutation.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- meant to reset mutation error whenever formik values change
  }, [formik.values])

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className={twMerge(
          "hover:bg-canvas/80 flex items-center space-x-4 rounded px-4",
          "focus-within:bg-canvas focus-within:border focus-within:border-blue-500",
          createMutation.isError ? "[&_svg]:text-red-600" : "[&_svg]:text-blue-500"
        )}
      >
        {createMutation.isPending ? (
          <Loader className="animate-spin" />
        ) : createMutation.isError ? (
          <CircleAlert />
        ) : (
          <Plus />
        )}
        <input
          disabled={createMutation.isPending}
          className={twMerge("h-[50px] grow", "!ring-0 !outline-0")}
          placeholder="New Topic"
          {...formik.getFieldProps("title")}
        />
      </form>
      {createMutation.isError ? (
        <p className="mt-1 px-4 text-sm text-red-600">
          {(createMutation.error.info as { message?: string })?.message}
        </p>
      ) : null}
    </div>
  )
}
