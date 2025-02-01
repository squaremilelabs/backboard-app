import { TaskBoxIcon, TopicBoxIcon } from "@/components/common/icons"

export default function Home() {
  return (
    <div className="space-y-2 p-4">
      <h1 className="font-serif text-2xl text-neutral-950">backboard</h1>
      <div className="flex items-center space-x-1 rounded-xs border-1 border-neutral-200 bg-neutral-50 p-1">
        <TaskBoxIcon />
        <p>Tasks</p>
      </div>
      <div className="flex items-center space-x-1 rounded-xs border-1 border-neutral-200 bg-neutral-50 p-1">
        <TopicBoxIcon />
        <p>Topics</p>
      </div>
    </div>
  )
}
