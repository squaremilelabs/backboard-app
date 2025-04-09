"use client"
import { useUser } from "@clerk/nextjs"
import { UseMutationResult } from "@tanstack/react-query"
import { CircleX, Loader, Plus } from "lucide-react"
import { ClassNameValue, twMerge } from "tailwind-merge"
import EditableText from "./EditableText"

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- to allow for any `useCreate` hook to be provided
type GenericUseMutationResult = UseMutationResult<any, any, any, any>

export default function CreateByTitleLine<T extends GenericUseMutationResult>({
  createMutation,
  additionalData,
  placeholder = "New",
  className,
}: {
  createMutation: T
  additionalData?: T["variables"]["data"]
  placeholder?: string
  className?: ClassNameValue
}) {
  const handleSubmit = (value: string) => {
    createMutation.mutate({ data: { title: value, ...additionalData } })
  }

  const errorMessage = createMutation.isError ? createMutation.error.info?.message : null
  const Icon = createMutation.isPending ? Loader : createMutation.isError ? CircleX : Plus

  const { isSignedIn } = useUser()
  if (!isSignedIn) return null

  return (
    <div className="flex flex-col gap-1">
      <div
        className={twMerge(
          "group/cbtl",
          "flex items-start gap-2 rounded-lg bg-transparent p-2",
          "focus-within:bg-canvas focus-within:ring-gold-500 focus-within:ring-2",
          "hover:bg-canvas ring-neutral-200 hover:ring-2",
          className
        )}
      >
        <Icon
          size={20}
          className={twMerge(
            "text-neutral-500 group-focus-within/cbtl:text-neutral-950",
            createMutation.isPending ? "!text-gold-500 animate-spin" : null,
            createMutation.isError ? "!text-red-600" : null
          )}
        />
        <EditableText
          initialValue=""
          onSave={handleSubmit}
          placeholder={placeholder}
          resetValueAfterSave
          className={twMerge(
            `grow resize-none font-normal !text-neutral-950 !no-underline placeholder-neutral-500 !ring-0
            !outline-0`
          )}
        />
      </div>
      {errorMessage ? <div className="px-2 text-sm text-red-600">{errorMessage}</div> : null}
    </div>
  )
}
