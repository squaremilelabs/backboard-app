"use client"

import { Button, Input, TextField } from "react-aria-components"
import { Loader, PlusIcon, XIcon } from "lucide-react"
import { FormEventHandler, useState } from "react"
import { twMerge } from "tailwind-merge"
import Modal from "../common/modal"
import { EmojiSelect } from "../common/emoji-dynamic"
import { useCreateTasklist } from "@/database/generated/hooks"

export default function TasklistCreate() {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState({
    title: "",
    emoji_code: "1f4cb",
    emoji_char: "📋",
  })

  const createTasklistMutation = useCreateTasklist()

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!values.title) return
    createTasklistMutation.mutate(
      {
        data: values,
      },
      {
        onSuccess: () => {
          setOpen(false)
          setValues((prev) => ({ ...prev, title: "" }))
        },
      }
    )
  }
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      triggerButton={
        <Button
          className={twMerge(
            "flex items-center gap-4 px-8 py-4",
            "cursor-pointer rounded-lg",
            "hover:bg-neutral-200"
          )}
        >
          <PlusIcon size={16} />
          <span>New tasklist</span>
        </Button>
      }
    >
      <div className="flex w-300 flex-col gap-16">
        <div className="flex items-center">
          <h1 className="grow text-lg font-medium text-neutral-700">New Tasklist</h1>
          <Button
            onPress={() => setOpen(false)}
            className="cursor-pointer rounded-md hover:opacity-70"
          >
            <XIcon size={20} />
          </Button>
        </div>
        <form
          onSubmit={handleSubmit}
          className={twMerge(
            "flex items-center gap-8 p-8",
            "rounded-md border-2 focus-within:outline"
          )}
        >
          <EmojiSelect
            selected={values.emoji_code}
            fallback="1f4cb"
            onSelect={({ emoji_char, emoji_code }) =>
              setValues({ ...values, emoji_code, emoji_char })
            }
          />
          <TextField
            isDisabled={createTasklistMutation.isPending}
            aria-label="Tasklist title"
            value={values.title}
            onChange={(value) => setValues({ ...values, title: value })}
            className={"flex grow"}
          >
            <Input className="grow !outline-0" placeholder="Enter title" />
          </TextField>
          {createTasklistMutation.isPending ? (
            <Loader className="text-gold-600 animate-spin" size={20} />
          ) : null}
        </form>
      </div>
    </Modal>
  )
}
