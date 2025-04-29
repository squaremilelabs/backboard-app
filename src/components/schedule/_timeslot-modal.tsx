"use client"
import { Dialog, Heading, Link, Modal, ModalOverlay } from "react-aria-components"
import { useRouter } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
import { XIcon } from "lucide-react"
import TimeslotTasksPanel from "./timeslot-tasks-panel"
import TimeslotTasklistTasksPanel from "./timeslot-tasklist-tasks-panel"
import { useFindUniqueTimeslot } from "@/database/generated/hooks"
import { useScheduleParams } from "@/lib/schedule"

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
          tasks: {
            where: {
              status: { in: ["TODO", "DRAFT"] },
              timeslot_id: null,
            },
          },
        },
      },
      tasks: true,
    },
  })

  const timeslot = timeslotQuery.data

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
          className="bg-canvas/50 grid max-h-[80dvh] max-w-[95dvw] grid-rows-[auto_1fr] overflow-auto rounded-xl border
            !outline-0"
        >
          <Heading slot="title" className="flex items-center justify-between px-16 py-8">
            <Link href={closeTimeslotHref} className="cursor-pointer rounded-md hover:opacity-70">
              <XIcon size={16} />
            </Link>
          </Heading>
          <div className="grid grid-cols-2 grid-rows-1 overflow-auto">
            {timeslot ? (
              <>
                <TimeslotTasksPanel timeslot={timeslot} />
                <TimeslotTasklistTasksPanel tasklist={timeslot.tasklist} />
              </>
            ) : null}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
