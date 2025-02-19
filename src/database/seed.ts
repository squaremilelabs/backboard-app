/* eslint-disable no-console */

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function seed() {
  const user = await prisma.user.create({
    data: {
      id: "user_2oGddhKfCXSQ7WiFT0RvWJJtBRO",
      display_name: "E",
      email: "e@squaremilelabs.com",
    },
  })

  const tony = await prisma.person.create({
    data: {
      created_by_id: user.id,
      name: "Tony",
    },
  })

  await prisma.$transaction([
    prisma.topic.create({
      data: {
        created_by_id: user.id,
        title: "2024 Taxes",
        tasks: {
          create: [
            {
              created_by_id: user.id,
              title: "Reconcile balance sheet accounts",
              order: 0,
              size_minutes: 150,
            },
            {
              created_by_id: user.id,
              title: "Gather all available tax documents",
              size_minutes: 45,
              order: 1,
            },
            {
              created_by_id: user.id,
              title: "Engage tax accountants",
              order: 2,
            },
          ],
        },
      },
    }),
    prisma.topic.create({
      data: {
        created_by_id: user.id,
        title: "Backboard MVP",
        viewers: {
          connect: [{ id: tony.id }],
        },
      },
    }),
    prisma.topic.create({
      data: {
        created_by_id: user.id,
        title: "Update MSA Template",
        contributors: {
          connect: [{ id: tony.id }],
        },
      },
    }),
  ])
}

seed()
  .then(() => console.log("seeded"))
  .catch((e) => console.error(e))
