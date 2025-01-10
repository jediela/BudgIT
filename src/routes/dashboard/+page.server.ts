import type { LoadEvent } from '@sveltejs/kit';

export async function load({ fetch }: LoadEvent) {
	try {
		const [expensesResponse, incomesResponse, budgetsResponse] = await Promise.all([
			fetch('/api/expenses/all', { credentials: 'include' }),
			fetch('/api/incomes/all', { credentials: 'include' }),
			fetch('/api/budget/all', { credentials: 'include' })
		]);

		if (!expensesResponse.ok || !incomesResponse.ok || !budgetsResponse.ok) {
			throw new Error('Failed to fetch one or more resources');
		}

		const expenses = await expensesResponse.json();
		const incomes = await incomesResponse.json();
		const budgets = await budgetsResponse.json();

		return {
			props: {
				expenses: expenses.expenses,
				incomes: incomes.incomes,
				budgets: budgets.budgets
			}
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			props: {
				expenses: [],
				incomes: [],
				budgets: []
			}
		};
	}
}
