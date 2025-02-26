import TopicPage from "./_parts/page"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TopicPage id={id} />
}
