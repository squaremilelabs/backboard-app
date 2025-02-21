import "@/styles/index.css"
import type { Metadata } from "next"
import { twMerge } from "tailwind-merge"
import React from "react"
import RootMain from "./_parts/main"
import RootProviders from "@/app/_parts/providers"
import RootNavbar from "@/app/_parts/navbar"
import { fontsClassName } from "@/styles/fonts"

export const metadata: Metadata = {
  title: "Backboard",
}

export default async function RootLayout({
  children,
  aside,
}: {
  children: React.ReactNode
  aside: React.ReactNode
}) {
  return (
    <html lang="en" className={twMerge(fontsClassName)} suppressHydrationWarning>
      <body>
        <RootProviders>
          <div className="@container/root grid h-dvh w-dvw grid-rows-[auto_1fr] overflow-auto">
            <RootNavbar />
            <RootMain aside={aside}>{children}</RootMain>
          </div>
        </RootProviders>
      </body>
    </html>
  )
}
