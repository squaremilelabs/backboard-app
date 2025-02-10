import { Link } from "react-aria-components"

export default function TaskPanel() {
  return (
    <div className="grid h-[1000px] w-full content-start">
      <h2 className="text-lg">Task Panel</h2>
      <Link href="/topic/1?panel=task:1">Go to Topic Page</Link>
    </div>
  )
}
