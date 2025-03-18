"use client"

import { useState } from "react"
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"
import { Archive, EllipsisVertical, Share2, Loader, Lock } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { UseMutationResult } from "@tanstack/react-query"
import { useUser } from "@clerk/nextjs"
import { formatDate } from "@/lib/utils"

interface RecordMetadata {
  id: string
  created_at: Date
  updated_at: Date
  is_public?: boolean
  archived_at: Date | null
}

type RecordType = "Topic" | "Resource" | "Tasklist" | "Task"

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- to allow for any `useUpdate` hook to be provided
type GenericUseMutationResult = UseMutationResult<any, any, any, any>

export default function MetadataPopover<T extends GenericUseMutationResult>({
  recordType,
  record,
  parentIsPublic,
  updateMutation,
  iconSize = 20,
}: {
  recordType: RecordType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- to allow for any record type to be passed
  record: (RecordMetadata & Record<string, any>) | null
  updateMutation: T
  parentIsPublic: boolean
  iconSize?: number
}) {
  const { isSignedIn } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  const handleArchiveToggle = () => {
    updateMutation.mutate({
      where: { id: record?.id },
      data: { archived_at: record?.archived_at ? null : new Date() },
    })
  }

  const handleVisibilityToggle = () => {
    updateMutation.mutate({
      where: { id: record?.id },
      data: { is_public: !record?.is_public },
    })
  }

  const displayedVisibility: "public" | "private" | null =
    record?.is_public === undefined
      ? null
      : recordType === "Topic"
        ? record?.is_public
          ? "public"
          : null
        : parentIsPublic
          ? !record?.is_public
            ? "private"
            : null
          : null

  const showVisibilityToggle =
    (recordType === "Topic" || parentIsPublic) && record?.is_public !== undefined

  if (!isSignedIn) return null

  return (
    <DialogTrigger>
      <Button
        onPress={() => setIsOpen((prev) => !prev)}
        className="focus-visible:!text-gold-500 flex items-center !outline-0"
      >
        <EllipsisVertical size={iconSize} className="text-neutral-500" />
        {record?.archived_at ? (
          <Archive size={iconSize} className="text-neutral-500" />
        ) : displayedVisibility === "public" ? (
          <Share2 size={iconSize} className="text-blue-600" />
        ) : displayedVisibility === "private" ? (
          <Lock size={iconSize} className="text-neutral-600" />
        ) : null}
      </Button>
      <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom right">
        <Dialog className="bg-canvas/50 flex flex-col gap-2 rounded-lg border p-2 text-neutral-600 !outline-0 backdrop-blur-xl">
          {/* LOADING */}
          {updateMutation.isPending ? (
            <Loader size={20} className="text-gold-500 animate-spin self-start" />
          ) : null}
          {/* VISIBILITY */}
          {showVisibilityToggle ? (
            <div className="flex items-stretch gap-2">
              <div
                className={twMerge(
                  "flex grow items-center justify-center gap-2 rounded p-2 text-sm",
                  record?.is_public ? "bg-blue-50 text-blue-600" : "bg-neutral-100 text-neutral-600"
                )}
              >
                {record?.is_public ? (
                  <>
                    <Share2 size={16} />
                    Shareable
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Private
                  </>
                )}
              </div>
              <Button
                onPress={handleVisibilityToggle}
                className={twMerge(
                  "flex grow items-center justify-center text-sm",
                  record?.is_public ? "" : "text-blue-600"
                )}
              >
                {record?.is_public ? "Make private" : "Make shareable"}
              </Button>
            </div>
          ) : null}
          {/* METADATA */}
          <div className="flex flex-col gap-1 rounded bg-neutral-100 p-2 [&_*]:text-sm">
            <p>
              <span className="font-medium">Created:</span>{" "}
              {formatDate(record?.created_at, { withTime: true })}
            </p>
            <p>
              <span className="font-medium">Last Updated:</span>{" "}
              {formatDate(record?.updated_at, { withTime: true })}
            </p>
          </div>
          {/* ARCHIVE BUTTON */}
          <Button
            onPress={handleArchiveToggle}
            className="flex items-center gap-1 self-start px-2 text-sm text-neutral-500"
          >
            <Archive size={14} />
            {record?.archived_at ? "Unarchive" : "Archive"}
          </Button>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}
