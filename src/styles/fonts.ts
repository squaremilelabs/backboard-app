import { Fira_Code as FontMono, Inter as FontSans, Noto_Serif as FontSerif } from "next/font/google"
import { twMerge } from "tailwind-merge"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const fontSerif = FontSerif({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const fontsClassName = twMerge(fontSans.variable, fontMono.variable, fontSerif.variable)
