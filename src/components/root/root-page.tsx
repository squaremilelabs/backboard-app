"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs"

export default function HomePage() {
  return (
    <div className="flex flex-col items-start">
      <p className="font-medium">
        <SignedIn>Learn Backboard</SignedIn>
        <SignedOut>Get an account</SignedOut>
      </p>
      <span>Reach out {"->"} e@squaremilelabs.com</span>
    </div>
  )
}
