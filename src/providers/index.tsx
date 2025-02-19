"use client"

import { ThemeProvider as NextThemeProvider } from "next-themes"
import { ClerkProvider } from "@clerk/nextjs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Provider as ZenstackHooksProvider } from "@/database/generated/hooks"

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <ZenstackHooksProvider value={{ endpoint: "/api/db" }}>
          <NextThemeProvider>{children}</NextThemeProvider>
        </ZenstackHooksProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ClerkProvider>
  )
}
