"use client"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"

type Params = {
  tasklist_id?: string
}

type SearchParams = {
  timeslot?: string | null
}

export default function useRouterUtility() {
  const pathname = usePathname()
  const params = useParams<Params>()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentParams = params
  const currentPath = pathname
  const currentPathParts = pathname.split("/").filter(Boolean)
  const currentHref = pathname + (searchParams.size ? `?${searchParams.toString()}` : "")
  const currentQuery = Object.fromEntries(searchParams.entries()) as SearchParams
  const currentBasePath = currentPathParts[0] ?? ""

  const getHref = (params: { path?: string; query?: SearchParams | null; merge?: boolean }) => {
    let constructedSearchParams = new URLSearchParams()
    if (params.query) {
      // if merge not set – will reset query
      if (params.merge) {
        constructedSearchParams = new URLSearchParams(searchParams.toString())
      }
      Object.entries(params.query).forEach(([key, value]) => {
        if (value === null) constructedSearchParams.delete(key)
        if (typeof value === "string") constructedSearchParams.set(key, value)
        // if undefined, do nothing
      })
    }
    // if path not provided, use current path
    const constructedPath = params.path ?? pathname
    return (
      constructedPath + (constructedSearchParams.toString() ? `?${constructedSearchParams}` : "")
    )
  }

  const push = () => (params: { path?: string; query?: SearchParams | null; merge?: boolean }) => {
    const constructedHref = getHref(params)
    router.push(constructedHref)
  }

  return {
    push,
    getHref,
    path: currentPath,
    pathParts: currentPathParts,
    basePath: currentBasePath,
    href: currentHref,
    query: currentQuery,
    params: currentParams,
  }
}
