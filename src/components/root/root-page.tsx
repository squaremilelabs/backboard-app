"use client"

import { SignedOut, Waitlist } from "@clerk/nextjs"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center pt-[10dvh]">
      <SignedOut>
        <Waitlist />
      </SignedOut>
    </div>
  )
}
