"use client"

import { PlusIcon } from "lucide-react"
import { useRef, useState } from "react"
import { ClassNameValue, twMerge } from "tailwind-merge"
import TextToInput from "./text-to-input"

export default function CreateInput({
  onSubmit,
  placeholder = "Add",
  endContent,
  className,
}: {
  onSubmit?: (value: string) => void
  placeholder?: string
  endContent?: React.ReactNode
  className?: ClassNameValue
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [inputValue, setInputValue] = useState("")

  const onPressEnter = () => {
    if (inputValue.trim() !== "") {
      if (onSubmit) onSubmit(inputValue)
      setInputValue("")
    }
  }

  const onPressEscape = () => {
    setInputValue("")
    inputRef.current?.blur()
  }

  return (
    <div
      className={twMerge(
        "group",
        "flex items-start gap-2 rounded-md border p-2",
        "bg-neutral-50 text-neutral-500 outline-neutral-400",
        "hover:bg-canvas",
        "focus-within:bg-canvas",
        "focus-within:outline",
        "focus-within:border-transparent",
        "has-[button[data-pressed]]:bg-canvas",
        "has-[button[data-pressed]]:outline",
        "has-[button[data-pressed]]:border-transparent",
        inputValue ? "bg-canvas text-neutral-950" : null,
        className
      )}
    >
      <div className="p-4">
        <PlusIcon className="size-20 min-w-20" />
      </div>
      <TextToInput
        value={inputValue}
        onValueChange={setInputValue}
        placeholder={placeholder}
        className={({}) => ["grow p-4 !outline-0"]}
        onPressEnter={onPressEnter}
        onPressEscape={onPressEscape}
      />
      {endContent ? (
        <div className="opacity-50 group-focus-within:opacity-100 group-has-[button[data-pressed]]:opacity-100">
          {endContent}
        </div>
      ) : null}
    </div>
  )
}
