import { ListTodo } from "lucide-react"

export default function Page() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <ListTodo size={24} />
        <h1 className="text-xl font-semibold">Tasks</h1>
      </div>
    </div>
  )
}
