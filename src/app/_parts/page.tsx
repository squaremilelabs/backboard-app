"use client"

import { Link } from "react-aria-components"
import { useUser } from "@clerk/nextjs"
import BackboardLogo from "@/components/backboard-logo"

export default function HomePage() {
  const { isSignedIn } = useUser()
  return (
    <div className="flex flex-col gap-8 rounded-lg border bg-neutral-100 p-8">
      <div className="flex items-center gap-2 text-neutral-500">
        <BackboardLogo size={24} />
        <h1 className="text-2xl font-medium">Backboard</h1>
      </div>
      <div className="flex flex-col gap-1 text-neutral-900">
        <p>
          A product of{" "}
          <Link
            href="https://squaremilelabs.com"
            target="_blank"
            className="text-gold-600 hover:opacity-60"
          >
            Square Mile Labs
          </Link>{" "}
          (in Beta)
        </p>
        <p>
          Checkout E&apos;s{" "}
          <Link
            // THIS IS THE PRODUCTION LINK
            href="/topic/cm7mokhx80000k4031bej9t4m"
            className="text-gold-600 hover:opacity-60"
          >
            &quot;Topic&quot;
          </Link>{" "}
          on Backboard
        </p>
        {isSignedIn ? (
          <>
            <p className="text-medium mt-8 font-medium">Thanks for joining the Beta! 🤝</p>
          </>
        ) : (
          <p>
            Reach out to <span className="text-gold-600">e@squaremilelabs.com</span> for an account
          </p>
        )}
      </div>
    </div>
  )
}
