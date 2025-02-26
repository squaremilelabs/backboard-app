"use client"

import { UseMutationResult } from "@tanstack/react-query"
import { CircleX, Loader, Plus } from "lucide-react"
import React, { useRef, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { ClassNameValue, twMerge } from "tailwind-merge"

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- to allow for any `useCreate` hook to be provided
type GenericUseMutationResult = UseMutationResult<any, any, any, any>

export default function CreateByTitleForm<T extends GenericUseMutationResult>({
  createMutation,
  additionalData,
  placeholder = "New",
  endContent,
  className,
}: {
  createMutation: T
  additionalData?: T["variables"]["data"]
  placeholder?: string
  endContent?: React.ReactNode
  className?: ClassNameValue
}) {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (input) {
      createMutation.mutate(
        { data: { title: input, ...additionalData } },
        { onSuccess: () => setInput("") }
      )
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === "Escape") {
      setInput("")
      createMutation.reset()
      inputRef.current?.blur()
    }
  }

  const errorMessage = createMutation.isError ? createMutation.error.info?.message : null

  const Icon = createMutation.isPending ? Loader : createMutation.isError ? CircleX : Plus
  return (
    <div className="flex flex-col gap-1">
      <div
        className={twMerge(
          "group",
          "flex items-start gap-2 rounded-lg bg-transparent p-2",
          "focus-within:bg-canvas focus-within:ring-gold-500 focus-within:ring-2",
          "hover:bg-canvas ring-neutral-200 hover:ring-2",
          className
        )}
      >
        <Icon
          size={20}
          className={twMerge(
            "text-neutral-500 group-focus-within:text-neutral-950",
            createMutation.isPending ? "!text-gold-500 animate-spin" : null,
            createMutation.isError ? "!text-red-600" : null
          )}
        />
        <TextareaAutosize
          ref={inputRef}
          placeholder={placeholder}
          value={input}
          disabled={createMutation.isPending}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={twMerge(
            "grow resize-none text-neutral-950 placeholder-neutral-500 !ring-0 !outline-0"
          )}
        />
        {endContent ? <div className="hidden group-focus-within:flex">{endContent}</div> : null}
      </div>
      {errorMessage ? <div className="px-2 text-sm text-red-600">{errorMessage}</div> : null}
    </div>
  )
}
