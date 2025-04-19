"use client"
import { useUser } from "@clerk/nextjs"
import { UseMutationResult } from "@tanstack/react-query"
import { CircleX, Loader, Plus } from "lucide-react"
import { useState } from "react"
import { ClassNameValue, twMerge } from "tailwind-merge"
import TextToInput, { TextToInputCallbackParams } from "./TextToInput"

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- to allow for any `useCreate` hook to be provided
type GenericUseMutationResult = UseMutationResult<any, any, any, any>

export default function CreateByTitleLine<T extends GenericUseMutationResult>({
  createMutation,
  additionalData,
  placeholder = "New",
  accentColor,
  className,
}: {
  createMutation: T
  additionalData?: T["variables"]["data"]
  placeholder?: string
  className?: ClassNameValue
  accentColor?: "gold" | "blue"
}) {
  const [input, setInput] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = ({ setIsActive }: TextToInputCallbackParams) => {
    if (input) {
      createMutation.mutate({ data: { title: input, ...additionalData } })
      setInput("")
      setIsActive(false)
    }
  }

  const handleReset = ({ setIsActive }: TextToInputCallbackParams) => {
    setInput("")
    createMutation.reset()
    setIsActive(false)
  }

  const errorMessage = createMutation.isError ? createMutation.error.info?.message : null
  const Icon = createMutation.isPending ? Loader : createMutation.isError ? CircleX : Plus

  const { isSignedIn } = useUser()
  if (!isSignedIn) return null

  return (
    <div className="flex flex-col gap-1">
      <div
        className={twMerge(
          "flex items-start gap-2 rounded-lg bg-transparent p-2",
          "hover:bg-canvas ring-neutral-200 hover:ring-2",
          isFocused
            ? [
                "bg-canvas ring-2 ring-neutral-500",
                accentColor === "gold" ? "ring-gold-300" : null,
                accentColor === "blue" ? "ring-blue-300" : null,
              ]
            : null,
          className
        )}
      >
        <Icon
          size={20}
          className={twMerge(
            "text-neutral-500",
            accentColor === "gold" ? "text-gold-600" : null,
            accentColor === "blue" ? "text-blue-600" : null,
            isFocused
              ? [
                  "text-neutral-950",
                  accentColor === "gold" ? "text-gold-600" : null,
                  accentColor === "blue" ? "text-blue-600" : null,
                ]
              : null,
            createMutation.isPending ? "animate-spin" : null,
            createMutation.isError ? "!text-red-600" : null
          )}
        />
        <TextToInput
          value={input}
          placeholder={placeholder}
          onValueChange={setInput}
          onActiveChange={setIsFocused}
          onPressEnter={handleSubmit}
          onPressEscape={handleReset}
          className={({ isButton, isInput }) =>
            twMerge(
              "grow text-neutral-950",
              isButton && !input ? "text-neutral-500" : null,
              isInput ? "placeholder-neutral-500" : null
            )
          }
        />
      </div>
      {errorMessage ? <div className="px-2 text-sm text-red-600">{errorMessage}</div> : null}
    </div>
  )
}
