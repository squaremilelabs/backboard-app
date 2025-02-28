import "@/styles/index.css"
import type { Metadata } from "next"
import { twMerge } from "tailwind-merge"
import React from "react"
import RootLayout from "./_parts/layout"
import RootProviders from "@/app/_parts/providers"
import { fontsClassName } from "@/styles/fonts"

export const metadata: Metadata = {
  title: "Backboard",
  description: "A home for bigger picture work",
  icons: {
    icon: [
      { rel: "apple-touch-icon", sizes: "57x57", url: "/icons/apple-icon-57x57.png" },
      { rel: "apple-touch-icon", sizes: "60x60", url: "/icons/apple-icon-60x60.png" },
      { rel: "apple-touch-icon", sizes: "72x72", url: "/icons/apple-icon-72x72.png" },
      { rel: "apple-touch-icon", sizes: "76x76", url: "/icons/apple-icon-76x76.png" },
      { rel: "apple-touch-icon", sizes: "114x114", url: "/icons/apple-icon-114x114.png" },
      { rel: "apple-touch-icon", sizes: "120x120", url: "/icons/apple-icon-120x120.png" },
      { rel: "apple-touch-icon", sizes: "144x144", url: "/icons/apple-icon-144x144.png" },
      { rel: "apple-touch-icon", sizes: "152x152", url: "/icons/apple-icon-152x152.png" },
      { rel: "apple-touch-icon", sizes: "180x180", url: "/icons/apple-icon-180x180.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", url: "/icons/android-icon-192x192.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/icons/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "96x96", url: "/icons/favicon-96x96.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/icons/favicon-16x16.png" },
    ],
  },
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
