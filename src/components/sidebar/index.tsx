"use client"

import BacklogSidebar from "./backlog-sidebar"
import CalendarSidebar from "./calendar-sidebar"
import useRouterUtility from "@/lib/router-utility"

export default function Sidebar() {
  const router = useRouterUtility()
  const basePath = router.pathParts[0]
  return basePath === "backlog" ? <BacklogSidebar /> : <CalendarSidebar />
}
