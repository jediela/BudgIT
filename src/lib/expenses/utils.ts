import { prisma } from '$lib/prisma';
import { json } from '@sveltejs/kit';
import type { User } from '@prisma/client';

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

/**
 * Checks if the user is authorized to access/modify the given expense.
 */
export function checkAuthorization(expense: { userId: number }, user: User) {
	if (expense.userId !== user.id) {
		throw json(
			{ status: 'error', message: 'Unauthorized, you do not have access to this expense' },
			{ status: 403 }
		);
	}
}
