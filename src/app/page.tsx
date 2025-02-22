import BackboardLogo from "@/components/common/backboard-logo"

export default function Home() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <BackboardLogo size={24} />
        <h1 className="text-xl font-semibold">Backboard</h1>
      </div>
    </div>
  )
}
