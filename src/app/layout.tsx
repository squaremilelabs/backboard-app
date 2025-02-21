import "@/styles/index.css"
import type { Metadata } from "next"
import { twMerge } from "tailwind-merge"
import React from "react"
import { fontsClassName } from "@/styles/fonts"
import Providers from "@/providers"
import { RootContainer } from "@/components/root/container"

export const metadata: Metadata = {
  title: "Backboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={twMerge(fontsClassName)} suppressHydrationWarning>
      <body>
        <Providers>
          <RootContainer>{children}</RootContainer>
        </Providers>
      </body>
    </html>
  )
}
