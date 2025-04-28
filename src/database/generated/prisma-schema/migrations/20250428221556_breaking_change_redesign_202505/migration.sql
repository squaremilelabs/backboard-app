-- BREAKING CHANGE MIGRATION --

/*
  Warnings:

  - The values [NOW,LATER] on the enum `TASK_STATUS` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `description` on the `tasklists` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `tasklists` table. All the data in the column will be lost.
  - You are about to drop the column `later_task_order` on the `tasklists` table. All the data in the column will be lost.
  - You are about to drop the column `now_task_order` on the `tasklists` table. All the data in the column will be lost.
  - You are about to drop the column `parent_tasklist_id` on the `tasklists` table. All the data in the column will be lost.
  - You are about to drop the column `parent_tasklist_topic_id` on the `tasklists` table. All the data in the column will be lost.
  - You are about to drop the column `sub_tasklist_order` on the `tasklists` table. All the data in the column will be lost.
  - You are about to drop the column `topic_id` on the `tasklists` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `done_at` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `tasklist_topic_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `topic_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `topic_order` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `resource_checklists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resource_links` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resource_notes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `topics` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `size_minutes` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/

-- DROP ALL DATA EXCEPT USERS
TRUNCATE "tasks", "tasklists", "resource_checklists", "resource_links", "resource_notes", "resources", "topics" CASCADE;

-- AlterEnum
BEGIN;
CREATE TYPE "TASK_STATUS_new" AS ENUM ('TODO', 'DRAFT', 'DONE');
ALTER TABLE "tasks" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "TASK_STATUS_new" USING ("status"::text::"TASK_STATUS_new");
ALTER TYPE "TASK_STATUS" RENAME TO "TASK_STATUS_old";
ALTER TYPE "TASK_STATUS_new" RENAME TO "TASK_STATUS";
DROP TYPE "TASK_STATUS_old";
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropForeignKey
ALTER TABLE "resource_checklists" DROP CONSTRAINT "resource_checklists_id_fkey";

-- DropForeignKey
ALTER TABLE "resource_links" DROP CONSTRAINT "resource_links_id_fkey";

-- DropForeignKey
ALTER TABLE "resource_notes" DROP CONSTRAINT "resource_notes_id_fkey";

-- DropForeignKey
ALTER TABLE "resources" DROP CONSTRAINT "resources_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "resources" DROP CONSTRAINT "resources_task_id_task_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "resources" DROP CONSTRAINT "resources_tasklist_id_tasklist_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "resources" DROP CONSTRAINT "resources_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "tasklists" DROP CONSTRAINT "tasklists_parent_tasklist_id_parent_tasklist_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "tasklists" DROP CONSTRAINT "tasklists_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_tasklist_id_tasklist_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "topics" DROP CONSTRAINT "topics_created_by_id_fkey";

-- DropIndex
DROP INDEX "tasklists_id_topic_id_key";

-- DropIndex
DROP INDEX "tasks_id_topic_id_key";

-- AlterTable
ALTER TABLE "tasklists" DROP COLUMN "description",
DROP COLUMN "is_public",
DROP COLUMN "later_task_order",
DROP COLUMN "now_task_order",
DROP COLUMN "parent_tasklist_id",
DROP COLUMN "parent_tasklist_topic_id",
DROP COLUMN "sub_tasklist_order",
DROP COLUMN "topic_id",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "emoji" JSONB,
ADD COLUMN     "task_order" TEXT[];

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "description",
DROP COLUMN "done_at",
DROP COLUMN "is_public",
DROP COLUMN "tasklist_topic_id",
DROP COLUMN "topic_id",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "timeslot_id" TEXT,
ADD COLUMN     "timeslot_tasklist_id" TEXT,
ALTER COLUMN "tasklist_id" DROP NOT NULL,
ALTER COLUMN "size_minutes" SET NOT NULL,
ALTER COLUMN "size_minutes" SET DEFAULT 5,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "topic_order",
ADD COLUMN     "inbox_task_order" TEXT[];

-- DropTable
DROP TABLE "resource_checklists";

-- DropTable
DROP TABLE "resource_links";

-- DropTable
DROP TABLE "resource_notes";

-- DropTable
DROP TABLE "resources";

-- DropTable
DROP TABLE "topics";

-- CreateTable
CREATE TABLE "timeslots" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "archived_at" TIMESTAMPTZ,
    "date_string" TEXT NOT NULL,
    "start_time_string" TEXT NOT NULL,
    "end_time_string" TEXT NOT NULL,
    "task_order" TEXT[],
    "tasklist_id" TEXT NOT NULL,

    CONSTRAINT "timeslots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "timeslots_id_tasklist_id_key" ON "timeslots"("id", "tasklist_id");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_tasklist_id_fkey" FOREIGN KEY ("tasklist_id") REFERENCES "tasklists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_timeslot_id_timeslot_tasklist_id_fkey" FOREIGN KEY ("timeslot_id", "timeslot_tasklist_id") REFERENCES "timeslots"("id", "tasklist_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeslots" ADD CONSTRAINT "timeslots_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeslots" ADD CONSTRAINT "timeslots_tasklist_id_fkey" FOREIGN KEY ("tasklist_id") REFERENCES "tasklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
