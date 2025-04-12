import {
  Button,
  Disclosure,
  DisclosurePanel,
  GridList,
  GridListItem,
  Heading,
} from "react-aria-components"
import { ChevronRight } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Task } from "@prisma/client"
import { twMerge } from "tailwind-merge"
import { Tasklist, TaskStatus } from "@zenstackhq/runtime/models"
import { useRef, useState } from "react"
import {
  useCreateTask,
  useFindManyTask,
  useUpdateTask,
  useUpdateTasklist,
} from "@/database/generated/hooks"
import CreateByTitleLine from "@/components/common/CreateByTitleLine"
import TaskItem from "@/components/task/TaskItem"
import useDragAndDropList from "@/hooks/useDragAndDropList"
import useDroppable from "@/hooks/useDroppable"
import { TASK_STATUS_UI_MAP } from "@/lib/constants"

export default function TasklistTasksContent({ tasklist }: { tasklist: Tasklist }) {
  const { user } = useUser()
  const createTask = useCreateTask()

  const nowTasksQuery = useFindManyTask({
    where: { tasklist_id: tasklist.id, status: "NOW", archived_at: null },
  })

  const laterTasksQuery = useFindManyTask({
    where: { tasklist_id: tasklist.id, status: "LATER", archived_at: null },
  })

  const doneTasksQuery = useFindManyTask({
    where: { tasklist_id: tasklist.id, status: "DONE", archived_at: null },
    orderBy: { done_at: "desc" },
  })

  const nowTasks = nowTasksQuery.data ?? []
  const laterTasks = laterTasksQuery.data ?? []
  const doneTasks = doneTasksQuery.data ?? []

  const nowTaskCount = nowTasks.length
  const laterTaskCount = laterTasks.length
  const doneTaskCount = doneTasks.length

  return (
    <div className="bg-canvas flex flex-col gap-2 rounded-lg border p-4">
      <TaskSection status="NOW" tasklist={tasklist} taskCount={nowTaskCount}>
        <UndoneTasks
          tasks={nowTasks}
          tasklist={tasklist}
          status="NOW"
          isFetched={nowTasksQuery.isFetched}
        />
        <CreateByTitleLine
          createMutation={createTask}
          placeholder="Add"
          additionalData={{
            topic: { connect: { id: tasklist.topic_id } },
            tasklist: { connect: { id: tasklist.id, topic_id: tasklist.topic_id } },
            created_by: { connect: { id: user?.id } },
            status: "NOW",
          }}
        />
      </TaskSection>
      <TaskSection status="LATER" taskCount={laterTaskCount} tasklist={tasklist}>
        <UndoneTasks
          tasks={laterTasks}
          tasklist={tasklist}
          status="LATER"
          isFetched={laterTasksQuery.isFetched}
        />
        <CreateByTitleLine
          createMutation={createTask}
          placeholder="Add"
          additionalData={{
            topic: { connect: { id: tasklist.topic_id } },
            tasklist: { connect: { id: tasklist.id, topic_id: tasklist.topic_id } },
            created_by: { connect: { id: user?.id } },
            status: "LATER",
          }}
        />
      </TaskSection>
      <TaskSection status="DONE" taskCount={doneTaskCount} tasklist={tasklist}>
        <DoneTasks tasks={doneTasks} tasklist={tasklist} />
      </TaskSection>
    </div>
  )
}

function TaskSection({
  status,
  tasklist,
  children,
  taskCount,
}: {
  status: TaskStatus
  tasklist: Tasklist
  children: React.ReactNode
  taskCount: number
}) {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const statusUI = TASK_STATUS_UI_MAP[status]

  const updateTask = useUpdateTask()
  const { dropProps, isDropTarget } = useDroppable<Task>({
    ref,
    itemType: "task",
    handleInsert: ([task]) => {
      updateTask.mutate({
        where: { id: task.id },
        data: {
          tasklist: { connect: { id: tasklist.id } },
          topic: { connect: { id: tasklist.topic_id } },
          status: status,
          done_at: status === "DONE" ? new Date() : null,
        },
      })
    },
  })
  return (
    <Disclosure
      isExpanded={expanded}
      onExpandedChange={setExpanded}
      className={({ isExpanded }) =>
        twMerge(
          "group/task-section rounded-lg",
          isExpanded ? "mb-2 p-2" : null,
          isDropTarget ? "outline-2" : null
        )
      }
    >
      <Heading ref={ref} {...dropProps} className="w-full">
        <Button
          slot="trigger"
          className={twMerge(
            "flex w-full items-center gap-2 rounded-lg p-1 !outline-0",
            "!opacity-100",
            "text-neutral-500",
            "hover:text-neutral-950",
            "hover:bg-neutral-100 dark:hover:bg-neutral-50",
            expanded
              ? [
                  "rounded-none p-2 text-neutral-950",
                  "bg-neutral-100 dark:bg-neutral-50",
                  "rounded-lg border",
                ]
              : null
          )}
        >
          <ChevronRight
            size={16}
            className="transition-transform group-data-expanded/task-section:rotate-90"
          />
          <span
            className={twMerge(
              "inline-flex w-[40px] items-center justify-center rounded-lg border text-sm",
              expanded ? "border-neutral-300" : null,
              taskCount > 0 && status === "LATER"
                ? [
                    "border-neutral-300 bg-neutral-200 text-neutral-950",
                    expanded ? "border-neutral-400" : "",
                  ]
                : null,
              taskCount > 0 && status === "NOW"
                ? ["bg-gold-500 border-gold-400 text-canvas", expanded ? "border-gold-700" : ""]
                : null
            )}
          >
            {taskCount}
          </span>
          <p className="text-left underline-offset-4 group-data-expanded/task-section:font-semibold">
            {statusUI.label}
          </p>
        </Button>
      </Heading>
      <DisclosurePanel
        className={twMerge(
          "flex flex-col",
          expanded ? "pt-2 pl-2" : null
          // taskCount > 0 ? "gap-2" : null
        )}
      >
        {children}
      </DisclosurePanel>
    </Disclosure>
  )
}

const taskGridListItemClassName = twMerge(
  "flex items-start p-2 rounded-lg outline-neutral-200 hover:outline-2"
)

function UndoneTasks({
  tasklist,
  tasks,
  status,
  isFetched,
}: {
  tasklist: Tasklist
  tasks: Task[]
  status: TaskStatus
  isFetched: boolean
}) {
  const updateTaskList = useUpdateTasklist()
  const updateTask = useUpdateTask()
  const { list, dragAndDropHooks } = useDragAndDropList({
    itemType: "task",
    items: tasks,
    isInitialized: isFetched,
    savedOrder: status === "NOW" ? tasklist.now_task_order : tasklist.later_task_order,
    handleOrderChange: (newOrder) => {
      updateTaskList.mutate({
        where: { id: tasklist.id },
        data: {
          now_task_order: status === "NOW" ? newOrder : undefined,
          later_task_order: status === "LATER" ? newOrder : undefined,
        },
      })
    },
    handleInsert: ([task]) => {
      updateTask.mutate({
        where: { id: task.id },
        data: {
          tasklist: { connect: { id: tasklist.id } },
          topic: { connect: { id: tasklist.topic_id } },
          status: status,
        },
      })
    },
  })
  return (
    <GridList
      aria-label="Reorderable To-Do Tasks"
      items={list.items}
      dragAndDropHooks={dragAndDropHooks}
    >
      {(task) => (
        <GridListItem className={taskGridListItemClassName} textValue={task.title}>
          <TaskItem task={task} tasklist={tasklist} />
        </GridListItem>
      )}
    </GridList>
  )
}

function DoneTasks({ tasklist, tasks }: { tasklist: Tasklist; tasks: Task[] }) {
  return (
    <GridList aria-label="Done Tasks by Done Date" className="flex flex-col" items={tasks}>
      {(task) => (
        <GridListItem className={taskGridListItemClassName} textValue={task.title}>
          <TaskItem task={task} tasklist={tasklist} />
        </GridListItem>
      )}
    </GridList>
  )
}
