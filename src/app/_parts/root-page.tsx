"use client"
import { SignedIn, SignedOut } from "@clerk/nextjs"

export default function HomePage() {
  return (
    <>
      <SignedIn>
        <UserContent />
      </SignedIn>
      <SignedOut>
        <VisitorContent />
      </SignedOut>
    </>
  )
}

function UserContent() {
  return <div>home</div>
}

function VisitorContent() {
  return <div>home</div>
}
