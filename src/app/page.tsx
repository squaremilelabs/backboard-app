import { CircleCheckBig } from "lucide-react"
import { TaskBoxIcon, TopicBoxIcon } from "@/components/common/icons"

export default function Home() {
  return (
    <div className="w-3/4 space-y-2 p-4">
      <h1 className="font-serif text-2xl text-neutral-950">backboard</h1>
      <div className="flex items-center space-x-0.5 rounded-xs border-1 border-neutral-200 bg-neutral-50 p-0.5 hover:bg-neutral-100">
        <TaskBoxIcon />
        <p className="grow px-2">Tasks</p>
        <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 text-green-600">
          <CircleCheckBig size={16} />
          <span>Done</span>
        </div>
      </div>
      <div className="flex items-center space-x-1 rounded-xs border-1 border-neutral-200 bg-neutral-50 p-1 hover:bg-neutral-100">
        <TopicBoxIcon />
        <p>Topics</p>
      </div>
    </div>
  )
}
