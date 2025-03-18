/*
  Warnings:

  - You are about to drop the column `content` on the `resources` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,topic_id]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resource_type` to the `resources` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "resources" DROP CONSTRAINT "resources_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "resources" DROP CONSTRAINT "resources_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "tasklists" DROP CONSTRAINT "tasklists_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "tasklists" DROP CONSTRAINT "tasklists_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_tasklist_id_tasklist_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "topics" DROP CONSTRAINT "topics_created_by_id_fkey";

-- AlterTable
ALTER TABLE "tasks" 
ADD COLUMN     "is_draft" BOOLEAN /* NOT NULL */ DEFAULT true, -- [MANUAL MODIFICATION: RE-APPLIED BELOW]
ADD COLUMN     "is_public" BOOLEAN /* NOT NULL */ DEFAULT false;  -- [MANUAL MODIFICATION: RE-APPLIED BELOW]

-- MANUAL MODIFICATION: Set default boolean values for new columns on existing tasks
UPDATE "tasks" SET "is_draft" = false, "is_public" = false;

-- MANUAL MODIFICATION: Reapply not-null constraint on new columns
ALTER TABLE "tasks" ALTER COLUMN "is_draft" SET NOT NULL;
ALTER TABLE "tasks" ALTER COLUMN "is_public" SET NOT NULL;

-- AlterTable
ALTER TABLE    "resources" 
-- DROP COLUMN "content" [MANUAL MODIFICATION: RE-APPLIED BELOW]
ADD COLUMN     "description" TEXT,
ADD COLUMN     "resource_type" TEXT, -- NOT NULL [MANUAL MODIFICATION: RE-APPLIED BELOW]
ADD COLUMN     "task_id" TEXT,
ADD COLUMN     "task_topic_id" TEXT,
ADD COLUMN     "tasklist_id" TEXT,
ADD COLUMN     "tasklist_topic_id" TEXT;

-- MANUAL MODIFICATION: Set all existing resources to type 'Note'
UPDATE "resources" SET "resource_type" = 'Note';

-- CreateTable
CREATE TABLE "resource_notes" (
    "id" TEXT NOT NULL,
    "content" TEXT,

    CONSTRAINT "resource_notes_pkey" PRIMARY KEY ("id")
);

-- MANUAL MODIFICATION: Copy content from resources to resource_notes
INSERT INTO "resource_notes" ("id", "content")
SELECT "id", "content" FROM "resources"
ON CONFLICT DO NOTHING;

-- MANUAL MODIFICATION: Drop content column from resources
ALTER TABLE "resources" DROP COLUMN "content";

-- MANUAL MODIFICATION: Set resource_type back to non-nullable
ALTER TABLE "resources" ALTER COLUMN "resource_type" SET NOT NULL;

-- CreateTable
CREATE TABLE "resource_links" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "resource_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tasks_id_topic_id_key" ON "tasks"("id", "topic_id");

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_tasklist_id_tasklist_topic_id_fkey" FOREIGN KEY ("tasklist_id", "tasklist_topic_id") REFERENCES "tasklists"("id", "topic_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_task_id_task_topic_id_fkey" FOREIGN KEY ("task_id", "task_topic_id") REFERENCES "tasks"("id", "topic_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_notes" ADD CONSTRAINT "resource_notes_id_fkey" FOREIGN KEY ("id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_links" ADD CONSTRAINT "resource_links_id_fkey" FOREIGN KEY ("id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasklists" ADD CONSTRAINT "tasklists_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasklists" ADD CONSTRAINT "tasklists_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_tasklist_id_tasklist_topic_id_fkey" FOREIGN KEY ("tasklist_id", "tasklist_topic_id") REFERENCES "tasklists"("id", "topic_id") ON DELETE CASCADE ON UPDATE CASCADE;
