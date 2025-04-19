"use client"
import { Prisma } from "@zenstackhq/runtime/models"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function useResourcePanelRouter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentParam = searchParams.get("rp")
  const [recordType, recordId] = currentParam?.split(":") ?? [null, null]

  let activeRecord: { type: Prisma.ModelName | null; id: string | null } | null = null

  if (recordType && recordId) {
    activeRecord = {
      type: recordType as Prisma.ModelName,
      id: recordId,
    }
  }

  const openPanel = (type: Prisma.ModelName, id: string) => {
    router.push(`${pathname}?rp=${type}:${id}`)
  }

  const closePanel = () => {
    router.push(`${pathname}`)
  }

  return {
    activeRecord,
    openPanel,
    closePanel,
  }
}
