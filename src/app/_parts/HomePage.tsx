"use client"
import { Link } from "react-aria-components"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { ExternalLink, Share2 } from "lucide-react"
import { twMerge } from "tailwind-merge"
import Image from "next/image"
import {
  BACKBOARD_INTRO_PAGE_LINK,
  PROD_BACKBOARD_TOPIC_ID,
  RELATIVE_TARGETS_UI_ENUM,
} from "@/lib/constants"
import { useCountUser } from "@/database/generated/hooks"
import { useTopicData } from "@/lib/topic"
import BackboardLogo from "@/components/common/BackboardLogo"

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

const headerClassName =
  "text from-gold-600 to-gold-400 inline-block bg-linear-to-br bg-clip-text text-2xl font-bold text-transparent"

function UserContent() {
  const userCount = useCountUser()
  const { data: backboardTopic } = useTopicData(PROD_BACKBOARD_TOPIC_ID)
  const nextTasklist = backboardTopic?._computed.next_tasklist
  const nextTasklistUI = nextTasklist ? RELATIVE_TARGETS_UI_ENUM[nextTasklist.target] : null
  return (
    <div className="flex w-fit flex-col gap-8 rounded-lg border bg-neutral-100 p-8">
      <div className="flex flex-col gap-1">
        <h2 className={headerClassName}>Thanks for joining Backboard.</h2>
        <p className="text-neutral-500">
          Currently, you&apos;re 1 of <span>{userCount.data ?? "--"}</span>.
        </p>
      </div>
      <p>
        If you haven&apos;t yet, read the{" "}
        <Link
          href={BACKBOARD_INTRO_PAGE_LINK}
          target="_blank"
          className="bg-canvas inline-flex items-center gap-1 rounded border px-2 text-neutral-600 hover:underline"
        >
          <span className="font-medium">Intro to Backboard</span>
          <ExternalLink size={12} />
        </Link>
      </p>
      <p>
        <span className="hidden md:inline-block">{"<-"} To the left</span>
        <span className="inline-block md:hidden">↑ Up top</span> are your <strong>Topics</strong>.
        Just yours.
      </p>
      <div className="flex flex-col items-start gap-2">
        <p>Backboard itself is one of my Topics.</p>
        <div className="bg-canvas/50 flex items-center gap-4 rounded-lg border p-4">
          <Image
            src="/images/e-headshot.png"
            width={30}
            height={30}
            alt="E's Headshot"
            className="rounded-full border-2 border-neutral-300"
          />
          <Link
            href={`/topic/${PROD_BACKBOARD_TOPIC_ID}`}
            className="group bg-canvas flex w-xs cursor-pointer items-center gap-1 rounded-lg border-2 p-2"
          >
            <p className="grow group-hover:font-semibold">Backboard</p>
            <Share2 size={14} className="text-neutral-500" />
            {nextTasklistUI ? (
              <span
                className={twMerge(
                  "size-[16px] min-w-[16px] rounded-full border-2",
                  nextTasklistUI.className
                )}
              />
            ) : null}
          </Link>
        </div>
        <p className="text-sm text-neutral-500">
          ^ Check it out from time to time to see what&apos;s next.
        </p>
      </div>
    </div>
  )
}

function VisitorContent() {
  return (
    <div
      className="flex h-[50dvh] flex-col items-center justify-center gap-4 rounded-lg border bg-neutral-100 p-4
        md:h-[90dvh]"
    >
      <div className="mb-4 flex flex-col items-center gap-2 md:hidden">
        <div className="flex items-center gap-1 hover:opacity-70">
          <Link
            href={BACKBOARD_INTRO_PAGE_LINK}
            target={"_blank"}
            className={twMerge(headerClassName)}
          >
            Join the Movement
          </Link>
          <ExternalLink className="text-gold-500" />
        </div>
        <div className="flex items-center gap-1 text-neutral-500">
          <BackboardLogo size={20} />
          <p className="text-lg font-medium">Backboard</p>
        </div>
      </div>
      <iframe
        className="hidden md:block"
        src="https://squaremilelabs.notion.site/ebd/1a9aece5ba118082ae09f3c876fe76a8"
        width="100%"
        height="100%"
        allowFullScreen
      />
      <div className="flex w-7/12 flex-col items-center gap-1">
        <p className="text-center">Still waiting on your invite?</p>
        <p className="text-center text-sm text-neutral-500">
          You might want to check your spam or &quot;promotions&quot; folder.
        </p>
      </div>
    </div>
  )
}
