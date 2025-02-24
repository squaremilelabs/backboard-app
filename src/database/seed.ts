/* eslint-disable no-console */

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function seed() {
  await prisma.user.create({
    data: {
      id: "user_2oGddhKfCXSQ7WiFT0RvWJJtBRO",
      display_name: "E",
      email: "e@squaremilelabs.com",
    },
  })
}

seed()
  .then(() => console.log("seeded"))
  .catch((e) => console.error(e))
