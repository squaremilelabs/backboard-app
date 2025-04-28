"use client"

import {
  Button,
  DialogTrigger,
  Input,
  ModalOverlay,
  Modal,
  TextField,
  Dialog,
} from "react-aria-components"
import { Loader, PlusIcon, XIcon } from "lucide-react"
import { FormEventHandler, useState } from "react"
import { twMerge } from "tailwind-merge"
import { EmojiSelect } from "../common/emoji"
import { useCreateTasklist } from "@/database/generated/hooks"

export default function TasklistCreateModal() {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState({
    title: "",
    emoji: { code: "1f4cb" },
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
    <DialogTrigger isOpen={open} onOpenChange={setOpen}>
      <Button
        className={twMerge(
          "flex items-center gap-4 px-8 py-4",
          "cursor-pointer rounded-xl",
          "hover:bg-neutral-200",
          "text-neutral-600"
        )}
      >
        <PlusIcon size={16} />
        <span>New List</span>
      </Button>
      <ModalOverlay className={"fixed inset-0 bg-neutral-100/30 backdrop-blur-xs"}>
        <Modal className={"fixed inset-0 flex h-dvh w-dvw flex-col items-center pt-[10%]"}>
          <Dialog className="bg-canvas rounded-xl border-2 p-16 !outline-0">
            <div className="flex w-300 flex-col gap-16">
              <div className="flex items-center">
                <h1 className="grow text-lg font-medium text-neutral-700">New List</h1>
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
                  selected={values.emoji.code}
                  fallback="1f4cb"
                  onSelect={(emoji) => setValues({ ...values, emoji: { code: emoji.unified } })}
                />
                <TextField
                  isDisabled={createTasklistMutation.isPending}
                  aria-label="List title"
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
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  )
}
