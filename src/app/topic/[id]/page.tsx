import { Metadata } from "next"
import { currentUser } from "@clerk/nextjs/server"
import { enhance } from "@zenstackhq/runtime"
import TopicPage from "./_parts/page"
import prisma from "@/database/prisma"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const user = await currentUser()
  const prismaEnhanced = enhance(prisma, {
    user: user ? { id: user.id, email: user.primaryEmailAddress?.emailAddress } : undefined,
  })
  const topic = await prismaEnhanced.topic.findUnique({
    where: { id },
  })
  if (topic) {
    return {
      title: topic.title,
      description: topic.description,
    }
  }
  return {
    description: "This topic is private",
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <TopicPage id={id} />
}
