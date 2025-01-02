/*
  Warnings:

  - The values [FOOD] on the enum `ExpenseTypes` will be removed. If these variants are still used in the database, this will fail.
  - The values [PAYCHECK] on the enum `IncomeTypes` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `date` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Income` table. All the data in the column will be lost.
  - Added the required column `month` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Month" AS ENUM ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

-- AlterEnum
BEGIN;
CREATE TYPE "ExpenseTypes_new" AS ENUM ('Food', 'Clothing', 'Electronics', 'Rent', 'Utilities', 'Transportation', 'Entertainment', 'Healthcare', 'Other');
ALTER TABLE "Expense" ALTER COLUMN "type" TYPE "ExpenseTypes_new" USING ("type"::text::"ExpenseTypes_new");
ALTER TYPE "ExpenseTypes" RENAME TO "ExpenseTypes_old";
ALTER TYPE "ExpenseTypes_new" RENAME TO "ExpenseTypes";
DROP TYPE "ExpenseTypes_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "IncomeTypes_new" AS ENUM ('Paycheck', 'Interest', 'Bonus', 'Investment', 'Other');
ALTER TABLE "Income" ALTER COLUMN "type" TYPE "IncomeTypes_new" USING ("type"::text::"IncomeTypes_new");
ALTER TYPE "IncomeTypes" RENAME TO "IncomeTypes_old";
ALTER TYPE "IncomeTypes_new" RENAME TO "IncomeTypes";
DROP TYPE "IncomeTypes_old";
COMMIT;

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "date",
ADD COLUMN     "month" "Month" NOT NULL;

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "date",
ADD COLUMN     "month" "Month" NOT NULL;
