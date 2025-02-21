import TopicPanel from "@/components/topic/topic-panel"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TopicPanel id={id} />
}
