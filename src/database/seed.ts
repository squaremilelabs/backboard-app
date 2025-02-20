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
              timing: "TODAY",
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
        tasks: {
          create: [
            {
              created_by_id: user.id,
              title: "Create wireframes",
              order: 0,
              size_minutes: 30,
              is_done: true,
              done_at: new Date(),
            },
            {
              created_by_id: user.id,
              title: "Write database & api",
              order: 1,
              size_minutes: 30,
              is_done: true,
              done_at: new Date(),
            },
            {
              created_by_id: user.id,
              title: "Build UI & deploy",
              order: 2,
              size_minutes: 30,
            },
          ],
        },
      },
    }),
    prisma.topic.create({
      data: {
        created_by_id: user.id,
        title: "Ledger MVP",
        viewers: {
          connect: [{ id: tony.id }],
        },
        tasks: {
          create: [
            {
              created_by_id: user.id,
              title: "Create wireframes",
              order: 0,
              size_minutes: 30,
              is_done: true,
              done_at: new Date(),
            },
            {
              created_by_id: user.id,
              title: "Write database & api",
              order: 1,
              size_minutes: 30,
              is_done: true,
              done_at: new Date(),
            },
          ],
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
