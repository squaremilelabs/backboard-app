"use client"

import { Link } from "react-aria-components"
import BackboardLogo from "@/components/backboard-logo"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 rounded-lg border bg-neutral-100 p-8">
      <div className="flex items-center gap-2">
        <BackboardLogo size={24} />
        <h1 className="text-2xl font-medium">Backboard</h1>
      </div>
      <div className="flex flex-col gap-1 text-neutral-500">
        <p>
          A product of{" "}
          <Link
            href="https://squaremilelabs.com"
            target="_blank"
            className="text-gold-600 hover:opacity-60"
          >
            Square Mile Foundry LLC
          </Link>{" "}
          (in Beta)
        </p>
        <p>
          Checkout E&apos;s public{" "}
          <Link
            // TODO: Update to real link
            href="https://squaremilelabs.com"
            target="_blank"
            className="text-gold-600 hover:opacity-60"
          >
            Topic
          </Link>{" "}
          on Backboard
        </p>
        <p>
          Reach out to E (<span className="underline">e@squaremilelabs.com</span>) for an account
        </p>
      </div>
    </div>
  )
}
