// import prisma from "./prisma"

// async function seed() {
//   const user = await prisma.user.create({
//     data: {
//       id: "PLACEHOLDER CLERK_ID",
//       name: "E",
//       email: "e@squaremilelabs.com",
//     },
//   })

//   const topics = await prisma.$transaction([
//     prisma.topic.create({
//       data: {
//         created_by_id: user.id,
//         title: "2024 Taxes",
//         status: "CURRENT",
//         tasks: {
//           create: [
//             {
//               created_by_id: user.id,
//               title: "Reconcile balance sheet accounts",
//               date: "2025-02-10",
//               status: "TO_DO",
//             },
//             {
//               created_by_id: user.id,
//               title: "Gather all available tax documents",
//               date: "2025-02-11",
//               status: "TO_DO",
//             },
//             {
//               created_by_id: user.id,
//               title: "Engage tax accountants",
//               date: "2025-02-12",
//               status: "TO_DO",
//             },
//           ],
//         },
//       },
//     }),
//     prisma.topic.create({
//       data: {
//         created_by_id: user.id,
//         title: "Backboard MVP",
//         status: "CURRENT",
//       },
//     }),
//     prisma.topic.create({
//       data: {
//         created_by_id: user.id,
//         title: "Update MSA Template",
//         status: "FUTURE",
//       },
//     }),
//   ])
// }
