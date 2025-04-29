"use client"
import { Dialog, Heading, Link, Modal, ModalOverlay } from "react-aria-components"
import { useRouter } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
import { XIcon } from "lucide-react"
import { startOfToday } from "date-fns"
import TasklistItem from "../tasklist/tasklist-item"
import TimeslotTasksPanel from "./timeslot-tasks-panel"
import TimeslotTasklistTasksPanel from "./timeslot-tasklist-tasks-panel"
import { useFindUniqueTimeslot } from "@/database/generated/hooks"
import { useScheduleParams } from "@/lib/schedule"

const startOfDate = startOfToday()

export default function TimeslotModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { timeslotId, closeTimeslotHref } = useScheduleParams()

  useEffect(() => {
    if (timeslotId) setIsOpen(true)
    else setIsOpen(false)
  }, [timeslotId])

  const timeslotQuery = useFindUniqueTimeslot({
    where: { id: timeslotId ?? "NO_TIMESLOT_ID" },
    include: {
      tasklist: {
        include: {
          // Unscheduled Tasks
          tasks: {
            where: {
              timeslot_id: null,
              OR: [{ status: "TODO" }, { status: "DONE", updated_at: { gte: startOfDate } }],
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
          className="bg-canvas/70 @container grid h-[80dvh] max-h-[80dvh] w-lg max-w-[95dvw] grid-rows-[auto_1fr] gap-16
            overflow-auto rounded-xl border p-16 !outline-0"
        >
          <Heading slot="title" className="flex items-center justify-between">
            {timeslot ? <TasklistItem tasklist={timeslot.tasklist} /> : null}
            <Link href={closeTimeslotHref} className="cursor-pointer rounded-md hover:opacity-70">
              <XIcon size={16} />
            </Link>
          </Heading>
          <div
            className="col-span-1 flex max-h-full flex-col gap-8 p-4 @md:grid @md:grid-cols-2 @md:grid-rows-1
              @md:items-start @md:gap-16"
          >
            {timeslot ? (
              <>
                <TimeslotTasklistTasksPanel
                  timeslot={timeslot}
                  tasklist={timeslot.tasklist}
                  refreshKey={refreshKey}
                />
                <TimeslotTasksPanel timeslot={timeslot} refreshKey={refreshKey} />
              </>
            ) : null}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
