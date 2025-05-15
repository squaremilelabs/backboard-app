"use client"

import React, { useEffect, useRef, useState } from "react"
import { FocusScope } from "react-aria"
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"
import { ClassNameValue, twMerge } from "tailwind-merge"
import TextareaAutosize from "react-textarea-autosize"
export interface TextToInputCallbackParams {
  isActive: boolean
  setIsActive: (isActive: boolean) => void
}

export type TextToInputClassNameProp =
  | ClassNameValue
  | ((params: { isActive: boolean; isButton: boolean; isInput: boolean }) => ClassNameValue)

export function TextToInput({
  value,
  onValueChange,
  placeholder,
  className,
  onPressEnter,
  onPressEscape,
  isMultiline,
  onActiveChange,
}: {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: TextToInputClassNameProp
  onPressEnter?: (params: TextToInputCallbackParams) => void
  onPressEscape?: (params: TextToInputCallbackParams) => void
  onActiveChange?: (isActive: boolean) => void
  isMultiline?: boolean
}) {
  const [isActive, setIsActive] = useState(false)

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
      if (onPressEnter) onPressEnter({ isActive, setIsActive })
    }
    if (e.key === "Escape") {
      if (onPressEscape) {
        e.preventDefault()
        onPressEscape({ isActive, setIsActive })
      }
    }
  }

  const appliedClassName = (slot: "button" | "input") =>
    typeof className === "function"
      ? className({ isActive, isButton: slot === "button", isInput: slot === "input" })
      : className

  return (
    <DialogTrigger
      isOpen={isActive}
      onOpenChange={(state) => {
        setIsActive(state)
        if (onActiveChange) onActiveChange(state)
      }}
    >
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
