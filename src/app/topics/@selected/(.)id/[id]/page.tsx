import SelectedTopicPanel from "@/app/topics/_parts/selected-topic-panel"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <SelectedTopicPanel id={id} />
}
