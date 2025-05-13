"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "react-aria-components"
import { ChevronLeftIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"
import TasklistEditableTitle from "@/components/primitives/tasklist/tasklist-editable-title"
import { iconBox, interactive } from "@/styles/class-names"

export default function TasklistHeader({ tasklistId }: { tasklistId: string }) {
  const { iso_week: isoWeek } = useParams<{ iso_week?: string }>()
  const router = useRouter()
  return (
    <div className="flex items-start gap-8">
      {isoWeek ? (
        <Button
          onPress={() => router.push(`/calendar/${isoWeek}`)}
          className={twMerge(iconBox({ size: "large" }), interactive({ hover: "background" }))}
        >
          <ChevronLeftIcon />
        </Button>
      ) : null}
      <TasklistEditableTitle tasklistId={tasklistId} />
    </div>
  )
}
