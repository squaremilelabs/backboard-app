"use client"

import { Link } from "react-aria-components"

export default function Page() {
  return (
    <div className="grid gap-2">
      <Link className="border" href="/tasks?panel=task:1">
        Open Task
      </Link>
    </div>
  )
}
