"use client"

import { ThemeProvider as NextThemeProvider } from "next-themes"
import { ClerkProvider } from "@clerk/nextjs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { RouterProvider } from "react-aria"
import { useRouter } from "next/navigation"
import { Provider as ZenstackHooksProvider } from "@/database/generated/hooks"

const queryClient = new QueryClient()

export default function RootProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <ZenstackHooksProvider value={{ endpoint: "/api/db" }}>
          <NextThemeProvider>
            <RouterProvider navigate={router.push}>{children}</RouterProvider>
          </NextThemeProvider>
        </ZenstackHooksProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ClerkProvider>
  )
}
