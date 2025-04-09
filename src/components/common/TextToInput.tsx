import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { FocusScope } from "react-aria"
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"
import { ClassNameValue, twMerge } from "tailwind-merge"
import TextareaAutosize from "react-textarea-autosize"

export interface TextToInputCallbackParams {
  isActive: boolean
  setIsActive: Dispatch<SetStateAction<boolean>>
}

export default function TextToInput({
  value,
  onValueChange,
  onActiveChange,
  placeholder,
  className,
  onPressEnter,
  onPressEscape,
}: {
  value: string
  onValueChange: (value: string) => void
  onActiveChange?: (isActive: boolean) => void
  placeholder?: string
  className?:
    | ClassNameValue
    | ((
        params: TextToInputCallbackParams & { isButton: boolean; isInput: boolean }
      ) => ClassNameValue)
  onPressEnter?: (params: TextToInputCallbackParams) => void
  onPressEscape?: (params: TextToInputCallbackParams) => void
}) {
  const [isActive, setIsActive] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(isActive)
    }
  }, [isActive, onActiveChange])

  // Implemented to match width of textarea popover with width of the trigger button
  const [triggerWidth, setTriggerWidth] = useState<number>(0)
  useEffect(() => {
    if (!triggerRef.current) return
    const observer = new ResizeObserver((entries) => {
      setTriggerWidth(entries[0].contentRect.width)
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
      ? className({ isActive, setIsActive, isButton: slot === "button", isInput: slot === "input" })
      : className

  return (
    <DialogTrigger isOpen={isActive} onOpenChange={setIsActive}>
      <Button
        className={twMerge(
          "inline-flex cursor-text justify-start text-left !outline-0",
          appliedClassName("button"),
          isActive ? "text-transparent" : null
        )}
        ref={triggerRef}
        onPress={() => setIsActive(true)}
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
              className={twMerge("w-full resize-none !outline-0", appliedClassName("input"))}
            />
          </FocusScope>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}
