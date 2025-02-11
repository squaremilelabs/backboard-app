import { Plus } from "lucide-react"
import { Button, Input } from "react-aria-components"

export function TaskCreateForm() {
  return (
    <form className="group grid w-full">
      <div className="grid h-[40px] grid-cols-[1fr_auto] items-stretch gap-2 rounded group-focus-within:border-2">
        <div className="grid grid-cols-[40px_1fr] items-center">
          <Plus className="text-gold-600 justify-self-center" size={20} />
          <Input className="!ring-0" placeholder="Add task" />
        </div>
        <div className="hidden items-stretch group-focus-within:flex">
          <Button>Status</Button>
        </div>
      </div>
    </form>
  )
}
