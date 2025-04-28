import { Tasklist } from "@zenstackhq/runtime/models"
import { EmojiStyle } from "emoji-picker-react"
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"
import { ArchiveIcon, EllipsisVertical } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { EmojiDynamic, EmojiSelect } from "../common/emoji"
import EditableText from "../common/editable-text"
import { defaultTasklistEmojiCode } from "@/lib/utils-tasklist"

export interface TasklistItemValues {
  title?: string
  emoji?: { code: string }
}

export default function TasklistItem({
  tasklist,
  onUpdate,
  onArchive,
}: {
  tasklist: Tasklist
  onUpdate?: (values: TasklistItemValues) => void
  onArchive?: () => void
}) {
  return (
    <div className="flex grow items-start gap-4">
      {onUpdate ? (
        <div className="flex grow items-start gap-4">
          <EmojiSelect
            selected={tasklist.emoji?.code || null}
            fallback={defaultTasklistEmojiCode}
            onSelect={(emoji) => onUpdate({ emoji: { code: emoji.unified } })}
          />
          <EditableText
            initialValue={tasklist.title}
            onSave={(title) => onUpdate({ title })}
            className={({}) => "grow text-left font-medium"}
          />
        </div>
      ) : (
        <div className={twMerge("flex grow items-start gap-4")}>
          <div className="flex size-20 min-w-20 items-center justify-center">
            <EmojiDynamic
              unified={tasklist.emoji?.code || defaultTasklistEmojiCode}
              emojiStyle={EmojiStyle.APPLE}
              size={16}
            />
          </div>
          <p className="grow truncate text-left font-medium">{tasklist.title}</p>
        </div>
      )}
      {onArchive ? (
        <DialogTrigger>
          <Button className="flex h-20 min-w-fit cursor-pointer items-center rounded-md text-neutral-400 hover:bg-neutral-200">
            <EllipsisVertical size={12} />
          </Button>
          <Popover
            offset={2}
            placement="left"
            className="bg-canvas/30 rounded-xl border-2 px-8 py-2 backdrop-blur-lg"
          >
            <Dialog className="!outline-0">
              <Button
                className="flex cursor-pointer items-center gap-4 rounded-md text-sm text-neutral-500 !outline-0
                  hover:text-red-700 focus-visible:text-red-700"
                onPress={onArchive}
              >
                Archive
                <ArchiveIcon size={12} />
              </Button>
            </Dialog>
          </Popover>
        </DialogTrigger>
      ) : null}
    </div>
  )
}
