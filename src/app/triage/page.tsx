import Inbox from "./_parts/inbox"
import Tasklists from "./_parts/tasklists"

export default function TriagePage() {
  return (
    <div className="grid h-full w-lg grid-cols-[1fr_1fr] gap-8">
      <div className="h-full">
        <Inbox />
      </div>
      <div className="h-full">
        <Tasklists />
      </div>
    </div>
  )
}
