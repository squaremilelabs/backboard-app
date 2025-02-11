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

  await prisma.task.createMany({
    data: [
      { created_by_id: user.id, title: "Reconcile balance sheet accounts", status: "DRAFT" },
      { created_by_id: user.id, title: "Gather all available tax documents", status: "DRAFT" },
      { created_by_id: user.id, title: "Engage tax accountant", status: "DRAFT" },
    ],
  })

  // const topics = await prisma.$transaction([
  //   prisma.topic.create({
  //     data: {
  //       created_by_id: user.id,
  //       title: "2024 Taxes",
  //       status: "CURRENT",
  //       tasks: {
  //         create: [
  //           {
  //             created_by_id: user.id,
  //             title: "Reconcile balance sheet accounts",
  //             date: "2025-02-10",
  //             status: "TO_DO",
  //           },
  //           {
  //             created_by_id: user.id,
  //             title: "Gather all available tax documents",
  //             date: "2025-02-11",
  //             status: "TO_DO",
  //           },
  //           {
  //             created_by_id: user.id,
  //             title: "Engage tax accountants",
  //             date: "2025-02-12",
  //             status: "TO_DO",
  //           },
  //         ],
  //       },
  //     },
  //   }),
  //   prisma.topic.create({
  //     data: {
  //       created_by_id: user.id,
  //       title: "Backboard MVP",
  //       status: "CURRENT",
  //     },
  //   }),
  //   prisma.topic.create({
  //     data: {
  //       created_by_id: user.id,
  //       title: "Update MSA Template",
  //       status: "FUTURE",
  //     },
  //   }),
  // ])
}

seed()
  .then(() => console.log("seeded"))
  .catch((e) => console.error(e))
