"use client"

import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import TextToInput, {
  TextToInputClassNameCallbackParams,
  TextToInputClassNameProp,
} from "./text-to-input"

export default function EditableText({
  isActive,
  initialValue,
  onSave,
  className,
  allowEmpty = false,
  placeholder,
  isMultiline,
  onActiveChange,
}: {
  isActive: boolean
  initialValue: string
  onSave: (value: string) => void
  className?: TextToInputClassNameProp
  allowEmpty?: boolean
  placeholder?: string
  onActiveChange: (isActive: boolean) => void
  isMultiline?: boolean
}) {
  const [innerValue, setInnerValue] = useState("")

  useEffect(() => {
    setInnerValue(initialValue)
  }, [initialValue])

  const handleActiveChange = (nextIsActive: boolean) => {
    // Handle resetting innerValue if leaving edit mode and left empty
    if (!nextIsActive) {
      if (!innerValue && !allowEmpty) {
        setInnerValue(initialValue)
      }
    }
    onActiveChange(nextIsActive)
  }

  const handleSubmitOrReset = () => {
    if (!innerValue && !allowEmpty) {
      setInnerValue(initialValue)
    } else {
      if (innerValue !== initialValue) {
        onSave(innerValue)
      }
    }
    onActiveChange(false)
  }

  const handleReset = () => {
    setInnerValue(initialValue)
    onActiveChange(false)
  }

  const appliedClassName = (params: TextToInputClassNameCallbackParams) =>
    typeof className === "function" ? className(params) : className

  return (
    <TextToInput
      isActive={isActive}
      onActiveChange={handleActiveChange}
      value={innerValue}
      onValueChange={setInnerValue}
      onPressEnter={handleSubmitOrReset}
      onPressEscape={handleReset}
      placeholder={placeholder}
      isMultiline={isMultiline}
      className={(params) =>
        twMerge(
          isActive ? "w-full grow" : null,
          params.isButton ? "cursor-text" : null,
          !innerValue && params.isButton ? "text-neutral-500" : null,
          !innerValue && params.isInput ? "placeholder-neutral-500" : null,
          appliedClassName(params)
        )
      }
    />
  )
}
