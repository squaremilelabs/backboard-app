"use client"
import { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { useState } from "react"
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { iconBox, IconBoxProps, interactive } from "@/styles/class-names"

export const EmojiPickerDynamic = dynamic(() => import("emoji-picker-react"), { ssr: false })

export const EmojiDynamic = dynamic(() => import("emoji-picker-react").then((mod) => mod.Emoji), {
  ssr: false,
})

export function Emoji({ code, size = "base" }: { code: string; size?: IconBoxProps["size"] }) {
  return (
    <div className={iconBox({ size })}>
      <EmojiDynamic unified={code} />
    </div>
  )
}

export function EmojiSelect({
  selected,
  onSelect,
  fallback,
  size,
}: {
  selected: string | null
  fallback: string
  onSelect: (emoji: EmojiClickData) => void
  size?: IconBoxProps["size"]
}) {
  const [innerSelected, setInnerSelected] = useState(selected ?? fallback)
  const { resolvedTheme } = useTheme()

  const handleSelect = (emoji: EmojiClickData) => {
    setInnerSelected(emoji.unified)
    onSelect(emoji)
  }

  const emojiTheme = resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT

  return (
    <DialogTrigger>
      <Button className={twMerge(iconBox({ size }), interactive({ hover: "background" }))}>
        <EmojiDynamic unified={innerSelected || fallback} />
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
