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

  const topics = await prisma.$transaction([
    // N-done / 1-current
    prisma.topic.create({
      data: {
        created_by_id: user.id,
        title: "2024 Taxes",
        description: "SML + Personal 2024 Tax Filings",
        tasks: {
          create: [
            {
              created_by_id: user.id,
              title: "Reconcile balance sheet accounts",
              is_done: true,
              done_at: new Date("2024-12-31"),
            },
            {
              created_by_id: user.id,
              title: "Gather all available tax documents",
              is_done: true,
              done_at: new Date("2025-01-15"),
            },
            {
              created_by_id: user.id,
              title: "Engage tax accountants",
              is_done: true,
              done_at: new Date("2025-02-15"),
            },
            {
              created_by_id: user.id,
              title: "Review and approve tax filings",
              target: "THIS_WEEK",
              is_done: false,
            },
          ],
        },
      },
      include: {
        tasks: { where: { is_done: false } },
      },
    }),
    // 0-done, 1 current ... Has viewers
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
              title: "Make wireframes",
              target: "NEXT_MONTH",
              is_done: false,
            },
          ],
        },
      },
      include: { tasks: true },
    }),
    // N-done
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
              title: "Build MVP",
              is_done: true,
              done_at: new Date("2025-02-28"),
            },
          ],
        },
      },
    }),
    // no tasks... Has contributors
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

  const [topic1, topic2] = topics

  // set last task as current for first 2 topics
  await prisma.topic.update({
    where: { id: topic1.id },
    data: {
      current_task: {
        connect: { id: topic1.tasks[0].id },
      },
    },
  })
  await prisma.topic.update({
    where: { id: topic2.id },
    data: {
      current_task: {
        connect: { id: topic2.tasks[0].id },
      },
    },
  })
}

seed()
  .then(() => console.log("seeded"))
  .catch((e) => console.error(e))
