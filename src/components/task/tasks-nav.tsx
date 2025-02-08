"use client"

import { Nav } from "../common/navigation"

export function TasksNav() {
  return (
    <div className="p-2">
      <Nav
        type="links"
        size="md"
        retainPanelParam
        items={[
          { hrefOrId: `/tasks/today`, title: "Today" },
          { hrefOrId: `/tasks/upcoming`, title: "Upcoming" },
          { hrefOrId: `/tasks/review`, title: "To Review" },
          { hrefOrId: `/tasks/closed`, title: "Closed" },
        ]}
        color="neutral"
      />
    </div>
  )
}
