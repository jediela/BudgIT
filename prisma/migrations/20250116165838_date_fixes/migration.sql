/*
  Warnings:

  - You are about to drop the column `month` on the `Budget` table. All the data in the column will be lost.
  - Added the required column `date` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "month",
ADD COLUMN     "date" DATE NOT NULL;

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Income" ALTER COLUMN "date" SET DATA TYPE DATE;
