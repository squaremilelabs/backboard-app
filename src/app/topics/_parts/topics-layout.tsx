export default function TopicsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="p-4">
        <h1 className="text-xl font-semibold">Topics</h1>
      </div>
      <div className="p-2 !pt-0 @md:p-4">{children}</div>
    </div>
  )
}
