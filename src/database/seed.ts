/* eslint-disable no-console */

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function seed() {
  const user = await prisma.user.create({
    data: {
      id: "user_2oGddhKfCXSQ7WiFT0RvWJJtBRO",
      name: "E",
      email: "e@squaremilelabs.com",
    },
  })

  await prisma.$transaction([
    prisma.topic.create({
      data: {
        created_by_id: user.id,
        title: "2024 Taxes",
        status: "CURRENT",
        tasks: {
          create: [
            {
              created_by_id: user.id,
              title: "Reconcile balance sheet accounts",
              size_minutes: 150,
              status: "TO_DO",
            },
            {
              created_by_id: user.id,
              title: "Gather all available tax documents",
              size_minutes: 45,
              status: "TO_DO",
            },
            {
              created_by_id: user.id,
              title: "Engage tax accountants",
              status: "DRAFT",
            },
          ],
        },
      },
    }),
    prisma.topic.create({
      data: {
        created_by_id: user.id,
        title: "Backboard MVP",
        status: "CURRENT",
      },
    }),
    prisma.topic.create({
      data: {
        created_by_id: user.id,
        title: "Update MSA Template",
        status: "FUTURE",
      },
    }),
  ])
}

seed()
  .then(() => console.log("seeded"))
  .catch((e) => console.error(e))
