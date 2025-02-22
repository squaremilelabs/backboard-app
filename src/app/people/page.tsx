import { ContactRound } from "lucide-react"

export default function Page() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <ContactRound size={24} />
        <h1 className="text-xl font-semibold">People</h1>
      </div>
    </div>
  )
}
