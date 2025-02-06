"use client"

import { ThemeProvider as NextThemeProvider } from "next-themes"
import { useRouter } from "next/navigation"
import { RouterProvider } from "react-aria-components"

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <NextThemeProvider>
      <RouterProvider navigate={router.push}>{children}</RouterProvider>
    </NextThemeProvider>
  )
}
