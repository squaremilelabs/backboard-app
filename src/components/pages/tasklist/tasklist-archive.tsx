import { Button } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { ArchiveIcon, ArchiveRestoreIcon, LoaderIcon } from "lucide-react"
import { ConfirmationButton } from "@/components/primitives/confirmation-button"
import { useFindUniqueTasklist, useUpdateTasklist } from "@/database/generated/hooks"
import { iconBox, interactive } from "@/styles/class-names"

export default function TasklistArchive({ tasklistId }: { tasklistId: string | undefined }) {
  const { data: tasklist } = useFindUniqueTasklist({ where: { id: tasklistId } })
  const isArchived = !!tasklist?.archived_at

  const { mutate: updateTasklist, ...updateTasklistMutation } = useUpdateTasklist()
  const handleArchiveToggle = () => {
    updateTasklist({
      where: { id: tasklist?.id },
      data: {
        archived_at: isArchived ? null : new Date(),
      },
    })
  }

  return (
    <ConfirmationButton
      onConfirm={handleArchiveToggle}
      content={
        isArchived
          ? "Restore tasklist? It will reappear in your sidebar."
          : "Archive tasklist? It will only be visible in weeks when it was active."
      }
      confirmButtonText={isArchived ? "Restore" : "Archive"}
      isDestructive={!isArchived}
    >
      <Button
        className={twMerge(
          interactive(),
          "flex items-center gap-2",
          "rounded-md",
          "text-neutral-500"
        )}
      >
        {updateTasklistMutation.isPending && (
          <div className={iconBox({ size: "small", className: "text-gold-500 animate-spin" })}>
            <LoaderIcon />
          </div>
        )}
        <p className="text-sm">{tasklist?.archived_at ? "Restore tasklist" : "Archive tasklist"}</p>
        <div className={iconBox({ size: "small", className: "text-neutral-500" })}>
          {isArchived ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
        </div>
      </Button>
    </ConfirmationButton>
  )
}
