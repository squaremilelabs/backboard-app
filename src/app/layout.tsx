import "@/styles/index.css"
import type { Metadata } from "next"
import { twMerge } from "tailwind-merge"
import React from "react"
import RootLayout from "./_parts/layout"
import RootProviders from "@/app/_parts/providers"
import { fontsClassName } from "@/styles/fonts"

export const metadata: Metadata = {
  title: "Backboard",
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={twMerge(fontsClassName)} suppressHydrationWarning>
      <body>
        <RootProviders>
          <RootLayout>{children}</RootLayout>
        </RootProviders>
      </body>
    </html>
  )
}
