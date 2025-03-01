import { Metadata } from "next"
import ArchivePage from "./_parts/page"

export const metadata: Metadata = {
  title: "Your Archive",
}

export default function Page() {
  return <ArchivePage />
}
