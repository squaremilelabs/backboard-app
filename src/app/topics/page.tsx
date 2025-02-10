"use client"

import { Link } from "react-aria-components"

export default function Page() {
  return (
    <div className="flex gap-2">
      <Link className="border" href="/topics?panel=topic:1">
        Open Topic
      </Link>
    </div>
  )
}
