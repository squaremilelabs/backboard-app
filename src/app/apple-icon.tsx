import { ImageResponse } from "next/og"
import BackboardLogo from "@/components/common/backboard-logo"

export const size = {
  width: 100,
  height: 100,
}
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(<BackboardLogo size={96} color="#0a0a0a" />, {
    ...size,
  })
}
