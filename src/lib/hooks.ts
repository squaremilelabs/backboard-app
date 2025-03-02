"use client"

import { useLocalStorage } from "usehooks-ts"

export function useTodayFilter() {
  const [todayFilter, setTodayFilter] = useLocalStorage("bb_today_filter_on", false)
  const toggleTodayFilter = () => setTodayFilter((prev) => !prev)
  return {
    todayFilter,
    setTodayFilter,
    toggleTodayFilter,
  }
}
