"use client"
import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"
import { twMerge } from "tailwind-merge"

export default function TopicsLayout({ children }: { children: React.ReactNode }) {
  const segments = useSelectedLayoutSegments()
  const isOnClosed = segments.includes("closed")
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="w-md max-w-full self-center px-5 py-4 @md:py-12">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-medium">Topics</h1>
        </div>
      </div>
      {/* Content */}
      <div className="w-md max-w-full self-center p-4 pt-0">{children}</div>
      <div className="mt-4 flex w-md max-w-full items-center justify-end self-center p-4 pt-0">
        <Link
          href={isOnClosed ? "/topics" : "/topics/closed"}
          className={twMerge("mr-2 cursor-pointer text-sm text-neutral-500 hover:underline")}
        >
          {isOnClosed ? "View Active Topics" : "View Closed Topics"}
        </Link>
      </div>
    </div>
  )
}
