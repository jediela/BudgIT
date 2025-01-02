import { prisma } from '$lib/prisma';
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
