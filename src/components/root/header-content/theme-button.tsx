"use client"
import { twMerge } from "tailwind-merge"
import { Moon, SunDim } from "lucide-react"
import { Button } from "react-aria-components"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { iconBox, interactive } from "@/styles/class-names"

export function ThemeButton() {
  const { setTheme, resolvedTheme } = useTheme()
  const [selected, setSelected] = useState<string | null>(null)
  useEffect(() => {
    if (resolvedTheme) {
      setSelected(resolvedTheme)
    }
  }, [resolvedTheme])

  if (!selected) return null

  const Icon = selected === "dark" ? Moon : SunDim
  return (
    <Button
      className={twMerge(interactive({ hover: "background" }), iconBox({ size: "large" }))}
      onPress={() => setTheme(selected === "dark" ? "light" : "dark")}
    >
      <Icon />
    </Button>
  )
}
