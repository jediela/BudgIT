import { prisma, Decimal } from '$lib/prisma';
import { json } from '@sveltejs/kit';

/**
 * Fetches an income by its ID and ensures it exists.
 */
export async function findIncomeById(id: number) {
	const income = await prisma.income.findUnique({ where: { id } });
	if (!income) {
		throw json({ status: 'error', message: 'Income not found' }, { status: 404 });
	}
	return income;
}

/**
 * Calculates the total income for the given month
 */
export function calculateMonthIncome(incomes: any[], month: string): number {
    const total = incomes
        .filter(income => income.month === month)
        .reduce((total, income) => total.add(new Decimal(income.amount)), new Decimal(0));

    return total.toNumber();
}