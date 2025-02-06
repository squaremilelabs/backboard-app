"use client"

import { useRouter } from "next/navigation"
import { Button } from "react-aria-components"

export default function Page() {
  const router = useRouter()
  return (
    <div>
      <Button onPress={() => router.push("/tasks?panel=")}>open panel</Button>
    </div>
  )
}
