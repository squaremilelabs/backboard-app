import Inbox from "./_parts/inbox"
import Tasklists from "./_parts/tasklists"

export default function TriagePage() {
  return (
    <div className="grid h-full w-full min-w-lg grid-cols-[3fr_4fr] gap-8">
      <div className="h-full">
        <Inbox />
      </div>
      <div className="h-full">
        <Tasklists />
      </div>
    </div>
  )
}
