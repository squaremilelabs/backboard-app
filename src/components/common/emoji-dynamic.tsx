"use client"

import { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"
import { ClassNameValue, twMerge } from "tailwind-merge"

export const EmojiPickerDynamic = dynamic(() => import("emoji-picker-react"), { ssr: false })

export const EmojiDynamic = dynamic(() => import("emoji-picker-react").then((mod) => mod.Emoji), {
  ssr: false,
})

export function EmojiSelect({
  selected,
  onSelect,
  fallback,
  buttonClassName,
  emojiSize = 20,
}: {
  selected: string | null
  fallback: string
  onSelect: (emoji: { emoji_code: string; emoji_char: string }) => void
  buttonClassName?: ClassNameValue
  emojiSize?: number
}) {
  const { resolvedTheme } = useTheme()
  const handleSelect = (emoji: EmojiClickData) => {
    onSelect({ emoji_code: emoji.unified, emoji_char: emoji.emoji })
  }

  const emojiTheme = resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT

  return (
    <DialogTrigger>
      <Button
        className={twMerge(
          "flex size-30 items-center justify-center",
          "cursor-pointer rounded-md hover:bg-neutral-300",
          buttonClassName
        )}
      >
        <EmojiDynamic unified={selected || fallback} size={emojiSize} />
      </Button>
      <Popover placement="bottom start" offset={4}>
        <Dialog className="!outline-0">
          <EmojiPickerDynamic
            onEmojiClick={handleSelect}
            emojiStyle={EmojiStyle.APPLE}
            theme={emojiTheme}
          />
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}
