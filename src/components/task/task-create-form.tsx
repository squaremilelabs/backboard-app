import { Plus } from "lucide-react"
import { Input } from "react-aria-components"
import { TaskStatusButton } from "./task-status"

export function TaskCreateForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className="group grid w-full">
      <div
        className="grid grid-cols-[1fr_auto] items-stretch gap-2 rounded p-0.5 pl-1 group-focus-within:bg-neutral-50
          hover:bg-neutral-50"
      >
        <div className="grid grid-cols-[auto_1fr] items-center gap-1">
          <Plus className="text-gold-600 justify-self-center" size={20} />
          <Input className="!ring-0" placeholder="Add task" />
        </div>
        <div className="hidden items-stretch group-focus-within:flex">
          <TaskStatusButton status="TO_DO" />
        </div>
      </div>
    </form>
  )
}
