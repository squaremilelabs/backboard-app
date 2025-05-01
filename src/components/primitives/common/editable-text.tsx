"use client"

import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import TextToInput, { TextToInputCallbackParams, TextToInputClassNameProp } from "./text-to-input"

export default function EditableText({
  initialValue,
  onSave,
  className,
  allowEmpty = false,
  placeholder,
  isMultiline,
}: {
  initialValue: string
  onSave: (value: string) => void
  className?: TextToInputClassNameProp
  allowEmpty?: boolean
  placeholder?: string
  isMultiline?: boolean
}) {
  const [innerValue, setInnerValue] = useState("")

  useEffect(() => {
    setInnerValue(initialValue)
  }, [initialValue])

  const handleActiveChange = (isActive: boolean) => {
    // handling changes when losing focus
    if (!isActive) {
      if (!innerValue && !allowEmpty) {
        setInnerValue(initialValue)
      } else {
        if (innerValue) {
          if (innerValue !== initialValue) {
            onSave(innerValue)
          }
        }
      }
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

  const appliedClassName = (params: { isActive: boolean; isButton: boolean; isInput: boolean }) =>
    typeof className === "function" ? className(params) : className

  return (
    <TextToInput
      value={innerValue}
      onValueChange={setInnerValue}
      onPressEnter={handleSubmitOrReset}
      onPressEscape={handleReset}
      placeholder={placeholder}
      isMultiline={isMultiline}
      onActiveChange={handleActiveChange}
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
