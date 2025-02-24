import { ChevronLeft, History, LibraryBig, Loader, Plus, FileText } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { Button, Input } from "react-aria-components"
import { useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { useFormik } from "formik"
import { TopicItem } from "@/lib/topic/item-data"
import {
  useCreatePost,
  useFindManyPost,
  useFindUniquePost,
  useUpdatePost,
} from "@/database/generated/hooks"
import { formatDate } from "@/lib/utils"

export default function TopicPosts({ topic }: { topic: TopicItem }) {
  const [showArchived, setShowArchived] = useState(false)
  const postsQuery = useFindManyPost({
    where: { topic_id: topic.id, is_archived: showArchived },
    orderBy: { updated_at: "desc" },
  })
  const posts = postsQuery.data || []

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  return (
    <div
      className={twMerge("flex flex-col gap-2 rounded border bg-neutral-100 p-2 @sm:gap-4 @sm:p-4")}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-500">
          <LibraryBig size={14} />
          <p className="text-sm">Posts</p>
        </div>
        {selectedPostId ? null : (
          <div className="flex items-center gap-2">
            <Button
              className="cursor-pointer text-xs text-neutral-500 hover:text-neutral-500 hover:underline"
              onPress={() => setShowArchived((prev) => !prev)}
            >
              {showArchived ? "Hide Archive" : "Show Archive"}
            </Button>
            <CreatePostButton topic={topic} />
          </div>
        )}
      </div>
      {!posts.length ? null : selectedPostId ? (
        <PostForm id={selectedPostId} closePost={() => setSelectedPostId(null)} />
      ) : (
        <div className="grid grid-cols-1 gap-1 @sm:grid-cols-2">
          {posts.map((post) => {
            return (
              <Button
                key={post.id}
                onPress={() => setSelectedPostId(post.id)}
                className={twMerge(
                  `bg-canvas hover:bg-canvas/80 flex cursor-pointer items-center justify-between gap-2 rounded border
                    p-2`
                )}
              >
                <div className="flex grow items-center gap-2 truncate">
                  <FileText size={16} className="text-neutral-400" />
                  <p className="truncate text-sm">{post.title}</p>
                </div>
                <p className="min-w-fit text-xs text-neutral-500">
                  {formatDate(post.updated_at, { withTime: true })}
                </p>
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CreatePostButton({ topic }: { topic: TopicItem }) {
  const createPost = useCreatePost()

  const handleCreate = () => {
    createPost.mutate({
      data: { title: "New Post", topic_id: topic.id },
    })
  }

  return (
    <Button
      className="bg-canvas flex cursor-pointer items-center gap-1 rounded border px-2 py-1 text-sm hover:opacity-60"
      isDisabled={createPost.isPending}
      onPress={handleCreate}
    >
      {createPost.isPending ? (
        <Loader size={14} className="animate-spin text-blue-500" />
      ) : (
        <Plus size={14} />
      )}
    </Button>
  )
}

function PostForm({ id, closePost }: { id: string; closePost: () => void }) {
  const postQuery = useFindUniquePost({ where: { id } })
  const post = postQuery.data
  const updatePost = useUpdatePost()

  const formik = useFormik({
    initialValues: {
      title: post?.title ?? "",
      content: post?.content ?? "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updatePost.mutate({ where: { id: post?.id }, data: values })
    },
  })

  const titleChanged = formik.values.title !== post?.title
  const contentChanged = formik.values.content !== (post?.content ?? "")

  return (
    <form
      className="bg-canvas/50 flex flex-col gap-2 rounded border p-2"
      onSubmit={formik.handleSubmit}
      onReset={() => formik.resetForm()}
    >
      <div className="flex items-center justify-between p-2">
        <div className="flex grow items-center gap-2">
          {formik.dirty ? null : (
            <Button className="cursor-pointer hover:opacity-60" onPress={closePost}>
              <ChevronLeft size={16} />
            </Button>
          )}
          <FileText size={16} className="text-neutral-500" />
          <Input
            {...formik.getFieldProps("title")}
            className={twMerge(
              "grow border-blue-600 font-medium !ring-0 !outline-0 focus:border-b focus:p-1",
              titleChanged ? "text-blue-600" : ""
            )}
          />
          <span className="flex min-w-fit items-center gap-1 text-xs text-neutral-500">
            <History size={12} /> {formatDate(post?.updated_at, { withTime: true })}
          </span>
          {updatePost.isPending ? (
            <Loader size={16} className="animate-spin text-blue-500" />
          ) : null}
        </div>
      </div>
      <TextareaAutosize
        {...formik.getFieldProps("content")}
        spellCheck={false}
        className={twMerge(
          "bg-canvas resize-none rounded border p-4 !ring-0 !outline-0",
          contentChanged ? "text-blue-600" : ""
        )}
        placeholder="Write something for this topic..."
        minRows={3}
      />
      <div className="flex items-center justify-between gap-4 pl-2">
        <div>
          <Button
            className="cursor-pointer text-sm text-neutral-400 hover:text-neutral-500 hover:underline"
            onPress={() => {
              updatePost.mutate({
                where: { id: post?.id },
                data: { is_archived: !post?.is_archived },
              })
            }}
          >
            {post?.is_archived ? "Unarchive" : "Archive"}
          </Button>
        </div>
        {formik.dirty ? (
          <div className="flex items-center gap-2">
            <Button
              className="cursor-pointer rounded border bg-neutral-100 px-4 py-1 text-sm text-blue-600 hover:opacity-60"
              type="reset"
            >
              Clear changes
            </Button>
            <Button
              className="cursor-pointer rounded border border-blue-200 bg-blue-100 px-4 py-1 text-sm text-blue-600
                hover:opacity-60"
              type="submit"
            >
              Save changes
            </Button>
          </div>
        ) : null}
      </div>
    </form>
  )
}
