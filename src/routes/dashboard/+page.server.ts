import { calculateMonthTotal } from '$lib/utils';
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

		const incomes = await incomesResponse.json();
		const expenses = await expensesResponse.json();
		const budgets = await budgetsResponse.json();

		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];

		const months = Array.from({ length: 12 }, (_, i) => i);

		const monthIncomes = months.reduce(
			(acc, month) => {
				acc[monthNames[month]] = calculateMonthTotal(incomes.incomes, month);
				return acc;
			},
			{} as Record<string, number>
		);

		const monthExpenses = months.reduce(
			(acc, month) => {
				acc[monthNames[month]] = calculateMonthTotal(expenses.expenses, month);
				return acc;
			},
			{} as Record<string, number>
		);

		console.log('monthIncomes:', monthIncomes);
		return {
			props: {
				incomes: incomes.incomes,
				expenses: expenses.expenses,
				budgets: budgets.budgets,
				monthIncomes: monthIncomes,
				monthExpenses: monthExpenses
			}
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			props: {
				expenses: [],
				incomes: [],
				budgets: [],
				monthIncomes: {},
				monthExpenses: {}
			}
		};
	}
}
