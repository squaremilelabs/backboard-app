import { ImageResponse } from "next/og"
import BackboardLogo from "@/components/common/backboard-logo"

export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(<BackboardLogo size={32} color="#64748b" />, {
    ...size,
  })
}
