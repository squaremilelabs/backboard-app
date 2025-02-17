"use client"

import { usePathname, useSearchParams, useRouter } from "next/navigation"

type AsideActive = {
  type: "topic" | "task"
  id: string
}

export default function useAside(): { active: AsideActive | null; closeAside: () => void } {
  const router = useRouter()
  const pathname = usePathname()

  const searchParams = useSearchParams()

  // Extract `active` value
  const asideParam = searchParams.get("aside")
  let active: AsideActive | null = null
  if (asideParam) {
    const [type, id] = asideParam.split(":")
    if (type && id) {
      if (type === "topic" || type === "task") {
        active = { type: type, id: id }
      }
    }
  }

  return {
    active,
    closeAside: () => {
      if (!active) return
      const updatedParams = new URLSearchParams(searchParams.toString())
      updatedParams.delete("aside")
      if (updatedParams.size === 0) {
        router.push(pathname)
        return
      }
      const newUrl = `${pathname}?${updatedParams.toString()}`
      router.push(newUrl)
    },
  }
}
