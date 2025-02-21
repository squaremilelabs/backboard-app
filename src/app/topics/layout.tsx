export default function TopicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8">
      <div>{children}</div>
    </div>
  )
}
