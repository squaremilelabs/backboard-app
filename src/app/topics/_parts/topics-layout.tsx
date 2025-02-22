import { BookMarked } from "lucide-react"

export default function TopicsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <BookMarked size={24} />
          <h1 className="text-xl font-semibold">Topics</h1>
        </div>
      </div>
      <div className="p-2 !pt-0 @md:p-4">{children}</div>
    </div>
  )
}
