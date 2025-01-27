import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { authenticate } from '$lib/auth/jwt.js';

export async function GET({ request }: RequestEvent) {
	const user = await authenticate(request);
	if (user instanceof Response) {
		return user;
	}

	try {
		const url = new URL(request.url);
		const queryParams = Object.fromEntries(url.searchParams.entries());
		const { date, type, sortBy, order = 'asc' } = queryParams;

		const filters: any = { userId: user.id };
		if (date) {
			filters.date = date;
		}
		if (type) {
			filters.type = type;
		}

		const validSortFields = ['limit', 'date'];
		if (sortBy && !validSortFields.includes(sortBy)) {
			return json({ status: 'error', message: `Invalid sortBy field: ${sortBy}` }, { status: 400 });
		}
		if (order !== 'asc' && order !== 'desc') {
			return json({ status: 'error', message: `Invalid order value: ${order}` }, { status: 400 });
		}

		const budgets = await prisma.budget.findMany({
			where: filters,
			orderBy: sortBy ? { [sortBy]: order } : undefined
		});

		return json(
			{
				status: 'success',
				message: budgets.length ? 'Budgets found' : 'No budgets match the criteria',
				budgets
			},
			{ status: 200 }
		);
	} catch (error: any) {
		return json(
			{ status: 'error', message: error.message || 'An unknown error occurred' },
			{ status: 500 }
		);
	}
}
