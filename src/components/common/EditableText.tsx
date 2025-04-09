"use client"

import { useEffect, useState } from "react"
import { ClassNameValue, twMerge } from "tailwind-merge"
import TextToInput, { TextToInputCallbackParams } from "./TextToInput"

export default function EditableText({
  initialValue,
  onSave,
  className,
  allowEmpty = false,
  placeholder,
}: {
  initialValue: string
  onSave: (value: string) => void
  className?: ClassNameValue
  allowEmpty?: boolean
  placeholder?: string
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

  const hasChanges = innerValue !== initialValue

  return (
    <TextToInput
      value={innerValue}
      onValueChange={setInnerValue}
      onPressEnter={handleSubmitOrReset}
      onPressEscape={handleReset}
      onActiveChange={handleActiveChange}
      placeholder={placeholder}
      className={({ isActive, isInput, isButton }) =>
        twMerge(
          isActive ? "grow" : null,
          isButton ? "decoration-gold-300 underline-offset-4 focus-visible:underline" : null,
          !innerValue && isButton ? "text-neutral-500" : null,
          !innerValue && isInput ? "placeholder-neutral-500" : null,
          className,
          hasChanges && isInput ? "text-gold-600" : null
        )
      }
    />
  )
}
