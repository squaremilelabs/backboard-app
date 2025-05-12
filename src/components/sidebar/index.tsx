"use client"

import BacklogSidebar from "./backlog-sidebar"
import useRouterUtility from "@/lib/router-utility"

export default function Sidebar() {
  const router = useRouterUtility()
  const basePath = router.pathParts[0]
  return basePath === "backlog" ? <BacklogSidebar /> : <div>placeholder: calendar sidebar</div>
}
