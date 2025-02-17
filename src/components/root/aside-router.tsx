"use client"
import TaskPanel from "../task/task-panel"
import TopicPanel from "../topic/topic-panel"
import useAside from "@/hooks/useAside"

export default function AsideRouter() {
  const { active } = useAside()
  if (!active) return <div></div> // empty aside
  if (active.type === "task") {
    return <TaskPanel />
  } else if (active.type === "topic") {
    return <TopicPanel id={active.id} />
  } else {
    return <div></div> // empty aside
  }
}
