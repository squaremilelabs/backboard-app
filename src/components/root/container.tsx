"use client"

import { twMerge } from "tailwind-merge"
import React from "react"
import RootHeader from "./header"

export function RootContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container/root grid h-dvh w-dvw grid-rows-[auto_1fr] divide-y overflow-auto">
      <RootHeader />
      <main className={twMerge("relative grid h-full max-h-full overflow-auto")}>{children}</main>
    </div>
  )
}
