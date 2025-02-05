import "@/styles/globals.css"
import type { Metadata } from "next"
import { twMerge } from "tailwind-merge"
import { fontsClassName } from "@/styles/fonts"
import Providers from "@/providers"
import { RootLayoutGrid } from "@/components/root/layout-grid"

export const metadata: Metadata = {
  title: "Backboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={twMerge(fontsClassName)} suppressHydrationWarning>
      <body>
        <Providers>
          <RootLayoutGrid>{children}</RootLayoutGrid>
        </Providers>
      </body>
    </html>
  )
}
