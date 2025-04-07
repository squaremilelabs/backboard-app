/*
  Warnings:

  - You are about to drop the column `target` on the `tasklists` table. All the data in the column will be lost.
  - You are about to drop the column `task_order` on the `tasklists` table. All the data in the column will be lost.
  - You are about to drop the column `is_draft` on the `tasks` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TASK_STATUS" AS ENUM ('NOW', 'LATER', 'DONE');

-- MANUAL MODIFICATION: Rename task order column
ALTER TABLE "tasklists" RENAME COLUMN "task_order" TO "later_task_order";

-- AlterTable
ALTER TABLE "tasklists" 
DROP COLUMN    "target",
ADD COLUMN     "now_task_order" TEXT[],
ADD COLUMN     "parent_tasklist_id" TEXT,
ADD COLUMN     "parent_tasklist_topic_id" TEXT,
ADD COLUMN     "sub_tasklist_order" TEXT[];

-- AlterTable
ALTER TABLE "tasks" 
DROP COLUMN  "is_draft",
ADD COLUMN     "status" "TASK_STATUS" NOT NULL DEFAULT 'LATER';

-- MANUAL MODIFICATION: Set default status to LATER for existing tasks
UPDATE "tasks" SET "status" = 'LATER';

-- AlterTable
ALTER TABLE "topics" ADD COLUMN     "tasklist_order" TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "topic_order" TEXT[];

-- DropEnum
DROP TYPE "RELATIVE_TARGET";

-- CreateTable
CREATE TABLE "resource_checklists" (
    "id" TEXT NOT NULL,
    "items" JSONB NOT NULL,

    CONSTRAINT "resource_checklists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "resource_checklists" ADD CONSTRAINT "resource_checklists_id_fkey" FOREIGN KEY ("id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasklists" ADD CONSTRAINT "tasklists_parent_tasklist_id_parent_tasklist_topic_id_fkey" FOREIGN KEY ("parent_tasklist_id", "parent_tasklist_topic_id") REFERENCES "tasklists"("id", "topic_id") ON DELETE SET NULL ON UPDATE CASCADE;
