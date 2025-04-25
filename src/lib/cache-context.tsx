"use client"

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react"

type Cache = Record<string, unknown>

interface CacheContextType {
  cache: Cache
  setCacheValue: <T = unknown>(key: string, value: T) => void
  getCacheValue: <T = unknown>(key: string) => T | undefined
  clearCache: () => void
}

const CacheContext = createContext<CacheContextType | undefined>(undefined)

export const CacheProvider = ({ children }: { children: ReactNode }) => {
  const [cache, setCache] = useState<Cache>({})

  const setCacheValue = useCallback(<T,>(key: string, value: T) => {
    setCache((prev) => ({ ...prev, [key]: value }))
  }, [])

  const getCacheValue = useCallback(
    <T,>(key: string): T | undefined => {
      return cache[key] as T
    },
    [cache]
  )

  const clearCache = useCallback(() => {
    setCache({})
  }, [])

  return (
    <CacheContext.Provider value={{ cache, setCacheValue, getCacheValue, clearCache }}>
      {children}
    </CacheContext.Provider>
  )
}

export const useCache = (): CacheContextType => {
  const context = useContext(CacheContext)
  if (!context) throw new Error("useCache must be used within a CacheProvider")
  return context
}
