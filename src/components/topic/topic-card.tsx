import { Topic } from "@prisma/client"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import { TopicStatusDisplay } from "./topic-status"

export default function TopicCard({
  topic,
  href,
  isFocused,
}: {
  topic: Topic
  href: string
  isFocused?: boolean
}) {
  return (
    <Link
      href={href}
      className={twMerge(
        "bg-canvas rounded border p-2",
        isFocused ? "ring-1 ring-blue-500 focus-visible:ring-2" : "",
        "hover:border-neutral-300"
      )}
    >
      <div className="flex items-center justify-between">
        <p>{topic.title}</p>
        <TopicStatusDisplay status={topic.status} />
      </div>
    </Link>
  )
}
