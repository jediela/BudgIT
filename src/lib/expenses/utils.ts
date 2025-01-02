import { prisma } from '$lib/prisma';
import { json } from '@sveltejs/kit';

/**
 * Fetches an expense by its ID and ensures it exists.
 */
export async function findExpenseById(id: number) {
	const expense = await prisma.expense.findUnique({ where: { id } });
	if (!expense) {
		throw json({ status: 'error', message: 'Expense not found' }, { status: 404 });
	}
	return expense;
}
