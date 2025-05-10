import useRouterUtility from "./router-utility"

export default function useModalControl() {
  const router = useRouterUtility<{ modal: string | null }>()

  const modalParam = router.query.modal
  const modalParamParts = (modalParam ?? "").split(":")

  let tasklistId: string | null = null
  let timeslotId: string | null = null

  modalParamParts.forEach((part) => {
    if (part.startsWith("tl_")) {
      tasklistId = part.split("_")[1]
    }
    if (part.startsWith("ts_")) {
      timeslotId = part.split("_")[1]
    }
  })

  const isInboxModal = modalParam === "inbox"
  const isTasklistBacklogModal = tasklistId && !timeslotId
  const isTasklistTimeslotModal = tasklistId && timeslotId

  const inboxModalHref = () =>
    router.constructHref({
      path: "CURRENT",
      query: { modal: "inbox" },
      merge: true,
    })

  const tasklistModalHref = (tasklistId: string) =>
    router.constructHref({
      path: "CURRENT",
      query: { modal: `tl_${tasklistId}` },
      merge: true,
    })

  const timeslotModalHref = (tasklistId: string, timeslotId: string) =>
    router.constructHref({
      path: "CURRENT",
      query: { modal: `ts_${tasklistId}:ts_${timeslotId}` },
      merge: true,
    })

  const closeModalHref = () =>
    router.constructHref({
      path: "CURRENT",
      query: { modal: null },
      merge: true,
    })

  return {
    type: isInboxModal
      ? "inbox"
      : isTasklistBacklogModal
        ? "tasklist-backlog"
        : isTasklistTimeslotModal
          ? "tasklist-timeslot"
          : null,
    inboxModalHref,
    tasklistModalHref,
    timeslotModalHref,
    closeModalHref,
  }
}
