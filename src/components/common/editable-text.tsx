"use client"

import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import TextToInput, {
  TextToInputCallbackParams,
  TextToInputClassNameCallbackParams,
  TextToInputClassNameProp,
} from "./text-to-input"

export default function EditableText({
  initialValue,
  onSave,
  className,
  allowEmpty = false,
  placeholder,
  onActiveChange,
  isMultiline,
}: {
  initialValue: string
  onSave: (value: string) => void
  className?: TextToInputClassNameProp
  allowEmpty?: boolean
  placeholder?: string
  onActiveChange?: (isActive: boolean) => void
  isMultiline?: boolean
}) {
  const [innerValue, setInnerValue] = useState("")

  useEffect(() => {
    setInnerValue(initialValue)
  }, [initialValue])

  const handleActiveChange = (isActive: boolean) => {
    // Handle resetting innerValue if leaving edit mode and left empty
    if (!isActive) {
      if (!innerValue && !allowEmpty) {
        setInnerValue(initialValue)
      }
    }
    if (onActiveChange) {
      onActiveChange(isActive)
    }
  }

  const handleSubmitOrReset = ({ setIsActive }: TextToInputCallbackParams) => {
    if (!innerValue && !allowEmpty) {
      setInnerValue(initialValue)
    } else {
      if (innerValue !== initialValue) {
        onSave(innerValue)
      }
    }
    setIsActive(false)
  }

  const handleReset = ({ setIsActive }: TextToInputCallbackParams) => {
    setInnerValue(initialValue)
    setIsActive(false)
  }

  const appliedClassName = (params: TextToInputClassNameCallbackParams) =>
    typeof className === "function" ? className(params) : className

  return (
    <TextToInput
      value={innerValue}
      onValueChange={setInnerValue}
      onPressEnter={handleSubmitOrReset}
      onPressEscape={handleReset}
      onActiveChange={handleActiveChange}
      placeholder={placeholder}
      isMultiline={isMultiline}
      className={(params) =>
        twMerge(
          params.isActive ? "w-full grow" : null,
          params.isButton ? "cursor-text" : null,
          !innerValue && params.isButton ? "text-neutral-500" : null,
          !innerValue && params.isInput ? "placeholder-neutral-500" : null,
          appliedClassName(params)
        )
      }
    />
  )
}
