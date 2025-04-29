"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function useRouterUtility<T extends Record<string, string>>() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentPath = pathname
  const currentPathParts = pathname.split("/").filter(Boolean)
  const currentHref = pathname + (searchParams.size ? `?${searchParams.toString()}` : "")
  const currentQuery = Object.fromEntries(searchParams.entries()) as T

  const constructHref = (params: {
    path: "CURRENT" | string
    query?: Partial<T> | null
    merge?: boolean
  }) => {
    let constructedSearchParams = new URLSearchParams()
    if (params.query) {
      if (params.merge) {
        constructedSearchParams = new URLSearchParams(searchParams.toString())
      }
      Object.entries(params.query).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          constructedSearchParams.set(key, value.toString())
        }
      })
    }
    const constructedPath = params.path === "CURRENT" ? pathname : params.path
    return (
      constructedPath + (constructedSearchParams.toString() ? `?${constructedSearchParams}` : "")
    )
  }

  const push = (params: { path: "CURRENT" | string; query?: Partial<T> | null }) => {
    const constructedHref = constructHref(params)
    router.push(constructedHref)
  }

  return {
    push,
    constructHref,
    path: currentPath,
    pathParts: currentPathParts,
    href: currentHref,
    query: currentQuery,
  }
}
