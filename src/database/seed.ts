/* eslint-disable no-console */

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function seed() {
  await prisma.user.create({
    data: {
      id: "user_2tbQf2EkPnJGNEmD1zlj7QmiRAq",
      display_name: "E",
      email: "e@squaremilelabs.com",
    },
  })
}

seed()
  .then(() => console.log("SEEDED DATABASE"))
  .catch((e) => {
    console.error("ERROR SEEDING DATABASE")
    console.error(e)
  })
