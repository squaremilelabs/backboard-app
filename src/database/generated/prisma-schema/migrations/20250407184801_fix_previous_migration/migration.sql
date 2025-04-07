-- MANUAL MODIFICATION: Set status to "DONE" if done_at is not null
UPDATE "tasks" SET "status" = 'DONE' WHERE "done_at" IS NOT NULL;

-- DropForeignKey
ALTER TABLE "tasklists" DROP CONSTRAINT "tasklists_parent_tasklist_id_parent_tasklist_topic_id_fkey";

-- AddForeignKey
ALTER TABLE "tasklists" ADD CONSTRAINT "tasklists_parent_tasklist_id_parent_tasklist_topic_id_fkey" FOREIGN KEY ("parent_tasklist_id", "parent_tasklist_topic_id") REFERENCES "tasklists"("id", "topic_id") ON DELETE CASCADE ON UPDATE CASCADE;
