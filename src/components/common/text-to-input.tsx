"use client"

import React, { useEffect, useRef, useState } from "react"
import { FocusScope } from "react-aria"
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"
import { ClassNameValue, twMerge } from "tailwind-merge"
import TextareaAutosize from "react-textarea-autosize"
export interface TextToInputClassNameCallbackParams {
  isButton: boolean
  isInput: boolean
}

export type TextToInputClassNameProp =
  | ClassNameValue
  | ((params: TextToInputClassNameCallbackParams) => ClassNameValue)

export default function TextToInput({
  value,
  onValueChange,
  placeholder,
  className,
  isActive,
  onActiveChange,
  onPressEnter,
  onPressEscape,
  isMultiline,
}: {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: TextToInputClassNameProp
  isActive: boolean
  onActiveChange: (isActive: boolean) => void
  onPressEnter?: () => void
  onPressEscape?: () => void
  isMultiline?: boolean
}) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Implemented to match width of textarea popover with width of the trigger button
  const [triggerWidth, setTriggerWidth] = useState<number>(0)
  useEffect(() => {
    if (!triggerRef.current) return
    const observer = new ResizeObserver((entries) => {
      setTriggerWidth(entries[0].borderBoxSize[0].inlineSize)
    })
    observer.observe(triggerRef.current)
    return () => observer.disconnect()
  }, [])

  const handleFocus = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.focus()
      textarea.setSelectionRange(textarea.value.length, textarea.value.length)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (isMultiline && e.shiftKey) return
      e.preventDefault()
      if (onPressEnter) onPressEnter()
    }
    if (e.key === "Escape") {
      if (onPressEscape) {
        e.preventDefault()
        onPressEscape()
      }
    }
  }

  const appliedClassName = (slot: "button" | "input") =>
    typeof className === "function"
      ? className({ isButton: slot === "button", isInput: slot === "input" })
      : className

  return (
    <DialogTrigger isOpen={isActive} onOpenChange={onActiveChange}>
      <Button
        className={twMerge(
          "inline-flex cursor-text justify-start text-left whitespace-pre-wrap",
          "decoration-neutral-500 underline-offset-4",
          "focus-visible:underline focus-visible:outline-0",
          "hover:underline",
          appliedClassName("button"),
          isActive ? "text-transparent" : null
        )}
        ref={triggerRef}
        onPress={() => onActiveChange(true)}
      >
        {value || placeholder}
      </Button>
      <Popover placement="left top" offset={-triggerWidth} style={{ width: triggerWidth }}>
        <Dialog className="w-full !outline-0">
          <FocusScope autoFocus>
            <TextareaAutosize
              placeholder={placeholder}
              ref={textareaRef}
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              className={twMerge(
                "w-full resize-none whitespace-pre-wrap !outline-0",
                "placeholder-neutral-500",
                appliedClassName("input")
              )}
              spellCheck={false}
            />
          </FocusScope>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}
