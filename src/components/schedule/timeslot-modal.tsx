"use client"
import { Dialog, Heading, Link, Modal, ModalOverlay } from "react-aria-components"
import { useRouter } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
import { parse } from "date-fns"
import { XIcon } from "lucide-react"
import TimeslotTasksPanel from "./timeslot-tasks-panel"
import { useFindUniqueTimeslot } from "@/database/generated/hooks"
import { useScheduleParams } from "@/lib/schedule"
import { formatDate, formatTimeString } from "@/lib/utils-common"

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
              OR: [{ status: "TODO" }, { status: "DONE", timeslot_id: timeslotId }],
            },
          },
        },
      },
    },
  })

  const timeslot = timeslotQuery.data

  // const timeslotStatus = timeslot
  //   ? getTimeslotStatus({
  //       date: timeslot.date_string,
  //       startTime: timeslot.start_time_string,
  //       endTime: timeslot.end_time_string,
  //     })
  //   : null

  const timeslotTitle = timeslot
    ? [
        formatDate(parse(timeslot.date_string, "yyyy-MM-dd", new Date()), { withWeekday: true }),
        formatTimeString(timeslot.start_time_string),
        "-",
        formatTimeString(timeslot.end_time_string),
      ].join(" ")
    : "Loading..."

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
        <Dialog className="bg-canvas/50 grid max-h-[80dvh] w-sm max-w-[95dvw] grid-rows-[auto_1fr] rounded-xl border !outline-0">
          <Heading slot="title" className="flex items-center justify-between px-16 py-8">
            <p className={twMerge("text-sm font-semibold text-neutral-600")}>{timeslotTitle}</p>
            <Link href={closeTimeslotHref} className="cursor-pointer rounded-md hover:opacity-70">
              <XIcon size={16} />
            </Link>
          </Heading>
          <div className="row-span-2 grid grid-cols-1 grid-rows-1">
            {timeslot ? <TimeslotTasksPanel timeslot={timeslotQuery.data} /> : null}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
