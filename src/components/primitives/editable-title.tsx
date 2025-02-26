import { UseMutationResult } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { ClassNameValue, twMerge } from "tailwind-merge"

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- to allow for any `useCreate` hook to be provided
type GenericUseMutationResult = UseMutationResult<any, any, any, any>

export default function EditableTitle<T extends GenericUseMutationResult>({
  record,
  updateMutation,
  placeholder = "Title",
  className,
}: {
  record: { id: string; title: string }
  updateMutation: T
  placeholder?: string
  className?: ClassNameValue
}) {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    setInput(record.title)
  }, [record.title])

  const handleSubmit = () => {
    if (input && input !== record.title) {
      updateMutation.mutate({
        where: { id: record.id },
        data: { title: input },
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === "Escape") {
      setInput(record.title)
      updateMutation.reset()
      inputRef.current?.blur()
    }
  }

  return (
    <TextareaAutosize
      ref={inputRef}
      placeholder={placeholder}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      spellCheck={false}
      className={twMerge(
        "focus:text-gold-600 grow resize-none !ring-0 !outline-0",
        "hover:text-neutral-500",
        updateMutation.isPending ? "animate-pulse" : null,
        className
      )}
      onKeyDown={handleKeyDown}
    />
  )
}
