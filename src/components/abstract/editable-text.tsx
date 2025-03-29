"use client"

import { useEffect, useRef, useState } from "react"
import { FocusScope } from "react-aria"
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"
import TextareaAutosize from "react-textarea-autosize"
import { twMerge } from "tailwind-merge"

export default function EditableText({
  initialValue,
  onSave,
}: {
  initialValue: string
  onSave: (value: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [innerValue, setInnerValue] = useState("")

  useEffect(() => {
    setInnerValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (!isEditing) {
      if (!innerValue) {
        setInnerValue(initialValue)
      }
    }
  }, [isEditing, initialValue, innerValue])

  const triggerRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleSubmitOrReset = () => {
    if (!innerValue) {
      setInnerValue(initialValue)
    } else {
      if (innerValue !== initialValue) {
        onSave(innerValue)
      }
    }
    setIsEditing(false)
  }

  const handleReset = () => {
    setInnerValue(initialValue)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmitOrReset()
    }

    if (e.key === "Escape") {
      handleReset()
    }
  }

  const hasChanges = innerValue !== initialValue

  return (
    <DialogTrigger isOpen={isEditing} onOpenChange={setIsEditing}>
      <Button
        ref={triggerRef}
        onPress={() => setIsEditing(true)}
        className={twMerge(
          "flex grow cursor-text justify-start text-start !outline-0",
          isEditing ? "text-transparent" : null,
          "underline-offset-2 focus-visible:underline"
        )}
      >
        {innerValue}
      </Button>
      <Popover placement="left top" offset={-triggerWidth} style={{ width: triggerWidth }}>
        <Dialog className="w-full !outline-0">
          <FocusScope autoFocus>
            <TextareaAutosize
              ref={textareaRef}
              value={innerValue}
              onChange={(e) => setInnerValue(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              onBlur={handleSubmitOrReset}
              className={twMerge(
                "w-full resize-none !outline-0",
                hasChanges ? "text-gold-600" : null
              )}
              spellCheck={false}
            />
          </FocusScope>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}
