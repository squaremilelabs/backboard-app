export default function TopicLayout({
  children,
  selected,
}: {
  children: React.ReactNode
  selected: React.ReactNode
}) {
  return (
    <div>
      <div>{children}</div>
      <div>{selected}</div>
    </div>
  )
}
