"use client"

import { useUser } from "@clerk/nextjs"
import { UseMutationResult } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { ClassNameValue, twMerge } from "tailwind-merge"

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- to allow for any `useCreate` hook to be provided
type GenericUseMutationResult = UseMutationResult<any, any, any, any>

export default function EditableText<T extends GenericUseMutationResult>({
  record,
  updateField = "title",
  updateMutation,
  placeholder = "Title",
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- to allow for any record type to be passed
  record: ({ id: string } & Record<string, any>) | null
  updateField?: string
  updateMutation: T
  placeholder?: string
  className?: ClassNameValue
}) {
  const { isSignedIn } = useUser()
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recordField = record ? (record[updateField] as string | null) : null

  useEffect(() => {
    if (recordField && !updateMutation.isPending) {
      setInput(recordField)
    }
  }, [recordField, updateField, updateMutation.isPending])

  const handleSubmit = () => {
    if (input && input !== recordField) {
      if (record) {
        updateMutation.mutate({
          where: { id: record.id },
          data: { [updateField]: input },
        })
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === "Escape") {
      setInput(recordField ?? "")
      updateMutation.reset()
    }
  }

  const hasChanges = input && recordField !== input

  return (
    <TextareaAutosize
      disabled={!isSignedIn}
      ref={inputRef}
      placeholder={placeholder}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onBlur={handleSubmit}
      spellCheck={false}
      className={twMerge(
        "grow resize-none !ring-0 !outline-0",
        "hover:text-neutral-500",
        hasChanges ? "!text-gold-600" : null,
        updateMutation.isPending ? "animate-pulse" : null,
        className
      )}
      onKeyDown={handleKeyDown}
    />
  )
}
