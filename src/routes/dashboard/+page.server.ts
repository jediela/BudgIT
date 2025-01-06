export async function load({ fetch }) {
	try {
		const [expensesResponse, incomesResponse] = await Promise.all([
			fetch('/api/expenses', { credentials: 'include' }),
			fetch('/api/incomes', { credentials: 'include' })
		]);

		if (!expensesResponse.ok || !incomesResponse.ok) {
			throw new Error('Failed to fetch one or more resources');
		}

		const expenses = await expensesResponse.json();
		const incomes = await incomesResponse.json();

		return {
			props: {
				expenses: expenses.expenses,
				incomes: incomes.incomes
			}
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			props: {
				expenses: [],
				incomes: []
			}
		};
	}
}
