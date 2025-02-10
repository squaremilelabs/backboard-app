"use client"

import { useSearchParams } from "next/navigation"
import TaskPanel from "../task/task-panel"
import TopicPanel from "../topic/topic-panel"

export default function PanelRouter() {
  const searchParams = useSearchParams()
  const panelParam = searchParams.get("panel")

  // If there is no panel param, return no-result ui
  if (!panelParam) return <div></div>

  const [type, id] = panelParam.split(":")

  // If the panel param is not in the correct format, return no-result ui
  if (!type || !id) return <div></div>

  // If the panel param is in the correct format, return the corresponding panel
  if (type === "task") {
    return <TaskPanel />
  } else if (type === "topic") {
    return <TopicPanel />
  } else {
    return <div></div>
  }
}
