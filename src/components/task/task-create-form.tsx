import { Plus } from "lucide-react"
import { Input } from "react-aria-components"
import { useFormik } from "formik"
import { TaskCreateScalarSchema } from "@zenstackhq/runtime/zod/models"
import { toFormikValidationSchema } from "zod-formik-adapter"
import { z } from "zod"
import { useMemo } from "react"
import { TaskStatusButton } from "./task-status"
import { useCreateTask } from "@/database/generated/hooks"

export function TaskCreateForm() {
  const createMutation = useCreateTask()

  const formik = useFormik<z.infer<typeof TaskCreateScalarSchema>>({
    initialValues: {
      title: "",
      status: "TO_DO",
      date: new Date(),
      size_minutes: 5,
    },
    validationSchema: toFormikValidationSchema(TaskCreateScalarSchema),
    onSubmit: (values) => {
      createMutation.mutate({ data: values })
    },
  })

  const errorMessage = useMemo(() => {
    if (createMutation.error) {
      const errorInfo = createMutation.error.info as { message: string }
      return errorInfo.message
    }
    return null
  }, [createMutation.error])

  return (
    <form onSubmit={formik.handleSubmit} className="group grid w-full">
      <div
        className="grid grid-cols-[1fr_auto] items-stretch gap-2 rounded p-0.5 pl-1 group-focus-within:bg-neutral-50
          hover:bg-neutral-50"
      >
        <div className="grid grid-cols-[auto_1fr] items-center gap-1">
          <Plus className="text-gold-600 justify-self-center" size={20} />
          <Input {...formik.getFieldProps("title")} className="!ring-0" placeholder="Add task" />
        </div>
        <div className="hidden items-stretch group-focus-within:flex">
          <TaskStatusButton status="TO_DO" />
        </div>
      </div>
      {errorMessage ? <div className="text-sm text-red-600">{errorMessage}</div> : null}
    </form>
  )
}
