import "@/styles/index.css"
import type { Metadata } from "next"
import { twMerge } from "tailwind-merge"
import React from "react"
import RootProviders from "@/app/_parts/providers"
import RootNavbar from "@/app/_parts/navbar"
import { fontsClassName } from "@/styles/fonts"

export const metadata: Metadata = {
  title: "Backboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={twMerge(fontsClassName)} suppressHydrationWarning>
      <body>
        <RootProviders>
          <div className="@container/root grid h-dvh w-dvw grid-rows-[auto_1fr] overflow-auto">
            <RootNavbar />
            <main className="@container/main relative grid h-full max-h-full grid-cols-1 grid-rows-1 overflow-auto">
              {children}
            </main>
          </div>
        </RootProviders>
      </body>
    </html>
  )
}
