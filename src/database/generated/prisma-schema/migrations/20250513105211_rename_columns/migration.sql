/*
  Warnings:

  - You are about to drop the column `date_string` on the `timeslots` table. All the data in the column will be lost.
  - You are about to drop the column `end_time_string` on the `timeslots` table. All the data in the column will be lost.
  - You are about to drop the column `start_time_string` on the `timeslots` table. All the data in the column will be lost.
  - You are about to drop the column `inbox_task_order` on the `users` table. All the data in the column will be lost.
  - Added the required column `date` to the `timeslots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `timeslots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `timeslots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "timeslots" 
RENAME COLUMN "date_string" TO "date";

ALTER TABLE "timeslots" 
RENAME COLUMN "start_time_string" TO "start_time";

ALTER TABLE "timeslots" 
RENAME COLUMN "end_time_string" TO "end_time";

-- AlterTable
ALTER TABLE "users" 
RENAME COLUMN "inbox_task_order" TO "task_order";

-- MOVE ALL TIMESLOTS TO EARLY MORNING
UPDATE "timeslots"
SET "start_time" = '00:00', "end_time" = '09:00';
