"use client"
import { Dialog, Heading, Link, Modal, ModalOverlay } from "react-aria-components"
import { useRouter } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
import { XIcon } from "lucide-react"
import TasklistItem from "../primitives/tasklist/tasklist-item"
import TimeslotTasksPanel from "./timeslot-tasks-panel"
import TimeslotTasklistTasksPanel from "./timeslot-tasklist-tasks-panel"
import { useFindUniqueTimeslot } from "@/database/generated/hooks"
import { useScheduleParams } from "@/lib/schedule-params"

export default function TimeslotModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { activeTimeslotId, closeTimeslotHref } = useScheduleParams()

  useEffect(() => {
    if (activeTimeslotId) setIsOpen(true)
    else setIsOpen(false)
  }, [activeTimeslotId])

  const timeslotQuery = useFindUniqueTimeslot({
    where: { id: activeTimeslotId ?? "NO_TIMESLOT_ID" },
    include: {
      tasklist: {
        include: {
          // Unscheduled Tasks
          tasks: {
            where: {
              timeslot_id: null,
              status: { in: ["TODO", "DONE"] },
            },
          },
        },
      },
      // Scheduled Tasks
      tasks: { where: { status: { in: ["TODO", "DONE"] } } },
    },
  })

  const timeslot = timeslotQuery.data

  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => {
    if (timeslotQuery.isFetchedAfterMount) {
      setRefreshKey(new Date().getTime())
    }
    return () => setRefreshKey(0)
  }, [timeslotQuery.isFetchedAfterMount])

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(state) => {
        if (!state) router.push(closeTimeslotHref)
        setIsOpen(state)
      }}
      className={twMerge(
        `fixed inset-0 z-50 flex h-dvh w-dvw flex-col items-center bg-neutral-100/30 pt-[10dvh]
        backdrop-blur-xs`
      )}
    >
      <Modal>
        <Dialog
          className="bg-canvas/70 @container grid max-h-[80dvh] w-sm max-w-[95dvw] grid-rows-[auto_1fr] gap-16
            overflow-auto rounded-xl border p-16 !outline-0"
        >
          <Heading slot="title" className="flex w-full items-center gap-8 truncate">
            <div className="grow truncate">
              {timeslot ? <TasklistItem tasklist={timeslot.tasklist} /> : null}
            </div>
            <Link href={closeTimeslotHref} className="cursor-pointer rounded-md hover:opacity-70">
              <XIcon size={20} />
            </Link>
          </Heading>
          <div className="flex w-full flex-col gap-8">
            {timeslot ? (
              <>
                <TimeslotTasksPanel timeslot={timeslot} className={() => [""]} />
                <TimeslotTasklistTasksPanel
                  timeslot={timeslot}
                  tasklist={timeslot.tasklist}
                  refreshKey={refreshKey}
                  className={({ isExpanded }) => [
                    "bg-transparent",
                    isExpanded ? "mt-8" : "w-fit self-end",
                  ]}
                />
              </>
            ) : null}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
