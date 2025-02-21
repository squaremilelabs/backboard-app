import "@/styles/index.css"
import type { Metadata } from "next"
import { twMerge } from "tailwind-merge"
import React from "react"
import RootProviders from "./_root-stuff/providers"
import RootNavbar from "./_root-stuff/navbar"
import { fontsClassName } from "@/styles/fonts"

export const metadata: Metadata = {
  title: "Backboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={twMerge(fontsClassName)} suppressHydrationWarning>
      <body>
        <RootProviders>
          <div className="@container/root grid h-dvh w-dvw grid-rows-[auto_1fr] divide-y overflow-auto">
            <RootNavbar />
            <main className={twMerge("relative grid h-full max-h-full overflow-auto")}>
              {children}
            </main>
          </div>
        </RootProviders>
      </body>
    </html>
  )
}
