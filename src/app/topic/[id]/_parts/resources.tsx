import { Resource as TResource } from "@prisma/client"
import { ChevronDown, File, FileText, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import TextareaAutosize from "react-textarea-autosize"
import {
  useCreateResource,
  useFindManyResource,
  useUpdateResource,
} from "@/database/generated/hooks"
import EditableText from "@/components/editable-text"
import CreateByTitleForm from "@/components/create-by-title-form"
import { formatDate } from "@/lib/utils"

export default function TopicResources({ topicId }: { topicId: string }) {
  const resourcesQuery = useFindManyResource({
    where: { topic_id: topicId, archived_at: null },
    orderBy: { updated_at: "desc" },
  })
  const createResource = useCreateResource()
  const resources = resourcesQuery.data
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-2 @sm:grid-cols-2">
        {resources?.map((resource) => <Resource key={resource.id} resource={resource} />)}
      </div>
      <div className="grid grid-cols-1 gap-2 @sm:grid-cols-2">
        <CreateByTitleForm
          createMutation={createResource}
          additionalData={{ topic_id: topicId }}
          placeholder="New Resource"
        />
      </div>
    </div>
  )
}

function Resource({ resource }: { resource: TResource }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const updateResource = useUpdateResource()

  const [contentValue, setContentValue] = useState("")
  useEffect(() => {
    if (resource.content) {
      setContentValue(resource.content)
    } else {
      setContentValue("")
    }
  }, [resource.content])

  const handleSave = () => {
    updateResource.mutate({
      where: { id: resource.id },
      data: { content: contentValue },
    })
  }

  const isUnsaved = contentValue !== (resource.content ?? "")
  const ContentIcon = contentValue ? FileText : File
  return (
    <Disclosure
      className={twMerge(
        "rounded-lg border bg-neutral-100 p-1",
        isExpanded ? "@sm:col-span-2" : ""
      )}
      isExpanded={isExpanded}
      onExpandedChange={setIsExpanded}
    >
      <Heading className="flex flex-col gap-2 p-2">
        <Button
          slot="trigger"
          className="focus-visible:text-gold-500 flex items-center justify-between gap-2 text-neutral-500 !outline-0"
        >
          <div className="flex items-center gap-2">
            <ContentIcon size={16} />
            {isUnsaved && !isExpanded ? (
              <p className="text-gold-600 text-sm">Unsaved!</p>
            ) : (
              <p className="text-sm">{formatDate(resource.updated_at, { withTime: true })}</p>
            )}
          </div>
          <ChevronDown
            size={20}
            className={twMerge("transition-transform", isExpanded ? "rotate-0" : "rotate-90")}
          />
        </Button>
        <div className="flex items-start gap-2">
          <EditableText record={resource} updateMutation={updateResource} />
        </div>
      </Heading>
      <DisclosurePanel className="flex flex-col gap-1">
        <div
          className={twMerge(
            "outline-neutral-300 focus-within:outline-1",
            isUnsaved ? "outline-gold-500 outline-1" : null,
            "bg-canvas flex flex-col gap-2 rounded-lg border p-4"
          )}
        >
          <TextareaAutosize
            value={contentValue}
            onChange={(e) => setContentValue(e.target.value)}
            spellCheck={false}
            className="resize-none !ring-0 !outline-0"
            placeholder="Write something..."
          />
          {isUnsaved ? (
            <div className="flex items-center justify-end gap-4">
              <Button
                isDisabled={updateResource.isPending}
                className={twMerge("text-sm text-neutral-500")}
                onPress={() => setContentValue(resource.content ?? "")}
              >
                Clear Changes
              </Button>
              <Button
                isDisabled={updateResource.isPending}
                className={twMerge("bg-gold-500 text-gold-50 rounded-full px-4 py-1 font-medium")}
                onPress={handleSave}
              >
                Save
              </Button>
              {updateResource.isPending ? (
                <Loader size={20} className="text-gold-500 animate-spin" />
              ) : null}
            </div>
          ) : null}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
