import Inbox from "./_parts/inbox"
import Tasklists from "./_parts/tasklists"

export default function TriagePage() {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-5">
        <Inbox />
      </div>
      <div className="col-span-7">
        <Tasklists />
      </div>
    </div>
  )
}
