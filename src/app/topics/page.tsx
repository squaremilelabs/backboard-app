"use client"

import { Link } from "react-aria-components"

export default function Page() {
  return (
    <div>
      <Link className="border" href="/topics?panel=topic:1">
        Open Topic
      </Link>
    </div>
  )
}
