"use client"
import { GridList, GridListItem, GridListItemRenderProps } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { useParams, usePathname } from "next/navigation"
import { ArrowRight, Bookmark, Check, SkipForward } from "lucide-react"
import { TopicItem } from "@/lib/topic/item-data"
import { formatDate } from "@/lib/utils"
import { TASK_DONE_TARGET_DISPLAY_MAP } from "@/lib/task/constants"

export default function TopicsGridList({
  topics,
  isLoading,
}: {
  topics: TopicItem[]
  isLoading: boolean
}) {
  const pathname = usePathname()
  const params = useParams<{ id: string }>()
  const selectedId = pathname.startsWith("/topic/") ? params.id : null

  // TODO: Replace with loading and empty UIs
  const emptyContent = (
    <div className="bg-neutral-50 p-4">{isLoading ? "Loading..." : "No topics"}</div>
  )

  return (
    <GridList
      aria-label="List of Topics"
      items={topics}
      renderEmptyState={() => emptyContent}
      dependencies={[selectedId]}
      className={twMerge("divide-y rounded border", selectedId ? "bg-neutral-100" : "bg-canvas")}
      keyboardNavigationBehavior="tab"
    >
      {(topic) => {
        const noneSelected = selectedId === null
        const isSelected = selectedId === topic.id
        return (
          <GridListItem
            key={topic.id}
            textValue={topic.title}
            id={topic.id}
            href={`/topic/${topic.id}`}
          >
            {(renderProps) => (
              <TopicsGridListItem
                topic={topic}
                renderProps={{ ...renderProps, isSelected, noneSelected }}
              />
            )}
          </GridListItem>
        )
      }}
    </GridList>
  )
}

function TopicsGridListItem({
  topic,
  renderProps,
}: {
  topic: TopicItem
  renderProps: GridListItemRenderProps & { isSelected: boolean; noneSelected: boolean }
}) {
  const nextTaskDisplay = topic._next_task
    ? TASK_DONE_TARGET_DISPLAY_MAP[topic._next_task.done_target]
    : null
  return (
    <div
      className={twMerge(
        "flex cursor-pointer items-center gap-2 p-4 hover:opacity-60",
        renderProps.isSelected ? "bg-canvas rounded" : ""
      )}
    >
      {/* Left section */}
      <div className="flex grow flex-col gap-1 truncate">
        {/* Icon + Title */}
        <div className="flex items-center gap-2 truncate">
          <Bookmark size={20} className={twMerge("text-neutral-400")} />
          <p className={twMerge("grow truncate font-medium")}>{topic.title}</p>
        </div>
        {/* Owner information will go here */}
      </div>
      {/* Right Section */}
      <div className="flex min-w-fit items-center gap-1">
        {nextTaskDisplay ? (
          <div
            className={twMerge(
              nextTaskDisplay?.className,
              "flex min-w-fit items-center gap-1 rounded-full border px-3 py-1 text-sm"
            )}
          >
            <SkipForward size={14} />
            {nextTaskDisplay?.label}
          </div>
        ) : topic._last_done_task ? (
          <div
            className={
              "flex min-w-fit items-center gap-1 rounded-full border px-3 py-1 text-neutral-600"
            }
          >
            <Check size={14} />
            <span className="text-sm">
              {topic._last_done_task.done_at ? formatDate(topic._last_done_task.done_at) : null}
            </span>
          </div>
        ) : null}
        {renderProps.isSelected ? <ArrowRight size={20} className="text-neutral-500" /> : null}
      </div>
    </div>
  )
}
