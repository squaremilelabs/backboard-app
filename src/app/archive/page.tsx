import { Metadata } from "next"
import ArchivePage from "./_parts/ArchivePage"

export const metadata: Metadata = {
  title: "Your Archive",
}

export default function Page() {
  return <ArchivePage />
}
