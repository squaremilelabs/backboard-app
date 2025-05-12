"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"

export default function useRouterUtility<T extends Record<string, string | null>>() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentPath = useMemo(() => pathname, [pathname])
  const currentPathParts = useMemo(() => pathname.split("/").filter(Boolean), [pathname])
  const currentHref = useMemo(
    () => pathname + (searchParams.size ? `?${searchParams.toString()}` : ""),
    [pathname, searchParams]
  )
  const currentQuery = useMemo(
    () => Object.fromEntries(searchParams.entries()) as T,
    [searchParams]
  )

  const constructHref = useCallback(
    (params: { path: "CURRENT" | string; query?: Partial<T> | null; merge?: boolean }) => {
      let constructedSearchParams = new URLSearchParams()
      if (params.query) {
        if (params.merge) {
          constructedSearchParams = new URLSearchParams(searchParams.toString())
        }
        Object.entries(params.query).forEach(([key, value]) => {
          if (value === null) constructedSearchParams.delete(key)
          if (typeof value === "string") constructedSearchParams.set(key, value)
          // if undefined, do nothing
        })
      }
      const constructedPath = params.path === "CURRENT" ? pathname : params.path
      return (
        constructedPath + (constructedSearchParams.toString() ? `?${constructedSearchParams}` : "")
      )
    },
    [searchParams, pathname]
  )

  const push = useCallback(
    () => (params: { path: "CURRENT" | string; query?: Partial<T> | null }) => {
      const constructedHref = constructHref(params)
      router.push(constructedHref)
    },
    [router, constructHref]
  )

  return {
    push,
    constructHref,
    path: currentPath,
    pathParts: currentPathParts,
    href: currentHref,
    query: currentQuery,
  }
}
