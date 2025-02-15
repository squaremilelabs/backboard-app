"use client"
import ResponsiveDiv from "@/components/common/responsive-div"
import { TopicsGrid } from "@/components/topic/topics-grid"

export default function Page() {
  return (
    <ResponsiveDiv width="lg">
      <TopicsGrid />
    </ResponsiveDiv>
  )
}
