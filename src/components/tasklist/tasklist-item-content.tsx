import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
import { Tasklist } from "@zenstackhq/runtime/models"
import { Button, Input, TextField } from "react-aria-components"
import { ArchiveIcon, Loader, XIcon } from "lucide-react"
import { EmojiStyle } from "emoji-picker-react"
import Modal from "../common/modal"
import { EmojiDynamic, EmojiSelect } from "../common/emoji-dynamic"
import { defaultTasklistEmojiCode } from "./utilities"
import { useUpdateTasklist } from "@/database/generated/hooks"

export function TasklistItemContent({ tasklist }: { tasklist: Tasklist }) {
  const [open, setOpen] = useState(false)
  const [innerValues, setInnerValues] = useState({
    title: tasklist.title,
    emoji: tasklist.emoji ?? { code: defaultTasklistEmojiCode },
  })

  useEffect(() => {
    setInnerValues({
      title: tasklist.title,
      emoji: tasklist.emoji ?? { code: defaultTasklistEmojiCode },
    })
  }, [tasklist])

  const updateTasklistMutation = useUpdateTasklist()
  const handleSubmit = () => {
    if (!innerValues.title) return
    updateTasklistMutation.mutate({
      where: { id: tasklist.id },
      data: innerValues,
    })
  }

  const handleArchive = () => {
    updateTasklistMutation.mutate({
      where: { id: tasklist.id },
      data: { archived_at: new Date() },
    })
  }

  useEffect(() => {
    if (tasklist.emoji?.code !== innerValues.emoji?.code) {
      handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasklist, innerValues])

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      triggerButton={
        <Button
          className={twMerge(
            "flex items-start gap-8",
            "cursor-pointer underline-offset-4 hover:underline",
            "rounded-md"
          )}
        >
          <EmojiDynamic
            unified={innerValues.emoji.code || defaultTasklistEmojiCode}
            emojiStyle={EmojiStyle.APPLE}
            size={16}
          />
          <p className="text-left font-medium">{innerValues.title}</p>
        </Button>
      }
    >
      <div className="flex w-300 flex-col gap-16">
        <div className="flex items-center">
          <h1 className="grow text-lg font-medium text-neutral-700">Edit Tasklist</h1>
          <Button
            onPress={() => setOpen(false)}
            className="cursor-pointer rounded-md hover:opacity-70"
          >
            <XIcon size={20} />
          </Button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className={twMerge(
            "flex items-center gap-8 p-8",
            "rounded-md border-2 focus-within:outline"
          )}
        >
          <EmojiSelect
            selected={innerValues.emoji.code ?? null}
            fallback={defaultTasklistEmojiCode}
            onSelect={(emoji) => {
              setInnerValues((prev) => ({ ...prev, emoji: { code: emoji.unified } }))
            }}
          />
          <TextField
            isDisabled={updateTasklistMutation.isPending}
            aria-label="Tasklist title"
            value={innerValues.title}
            onChange={(value) => setInnerValues((prev) => ({ ...prev, title: value }))}
            className={"flex grow"}
          >
            <Input className="grow !outline-0" placeholder="Enter title" />
          </TextField>
          {updateTasklistMutation.isPending ? (
            <Loader className="text-gold-600 animate-spin" size={20} />
          ) : null}
        </form>
        <Button
          className="flex cursor-pointer items-center gap-4 self-end text-sm text-neutral-400 hover:text-neutral-700"
          onPress={handleArchive}
        >
          Archive tasklist
          <ArchiveIcon size={12} />
        </Button>
      </div>
    </Modal>
  )
}
