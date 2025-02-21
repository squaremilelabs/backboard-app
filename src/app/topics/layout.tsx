export default function TopicLayout({
  children,
  selected,
}: {
  children: React.ReactNode
  selected: React.ReactNode
}) {
  return (
    <div className="p-8">
      <div>{children}</div>
      <div>{selected}</div>
    </div>
  )
}
