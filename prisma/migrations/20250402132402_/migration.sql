/*
  Warnings:

  - A unique constraint covering the columns `[serviceAssignmentCode]` on the table `team_members` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `team_members` MODIFY `gender` VARCHAR(191) NULL DEFAULT 'Non défini';

-- CreateIndex
CREATE UNIQUE INDEX `team_members_serviceAssignmentCode_key` ON `team_members`(`serviceAssignmentCode`);
