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
		const { name, description, month, card, type, sortBy, order = 'asc' } = queryParams;

		const filters: any = { userId: user.id };
		if (name) {
			filters.name = { contains: name, mode: 'insensitive' };
		}
		if (description) {
			filters.description = { contains: description, mode: 'insensitive' };
		}
		if (month) {
			filters.month = month;
		}
		if (card) {
			filters.card = card;
		}
		if (type) {
			filters.type = type;
		}

		const validSortFields = ['name', 'month', 'amount'];
		if (sortBy && !validSortFields.includes(sortBy)) {
			return json({ status: 'error', message: `Invalid sortBy field: ${sortBy}` }, { status: 400 });
		}
		if (order !== 'asc' && order !== 'desc') {
			return json({ status: 'error', message: `Invalid order value: ${order}` }, { status: 400 });
		}

		const expenses = await prisma.expense.findMany({
			where: filters,
			orderBy: sortBy ? { [sortBy]: order } : undefined
		});

		return json(
			{
				status: 'success',
				message: 'Expenses found',
				expenses,
				meta: { total: expenses.length }
			},
			{ status: 200 }
		);
	} catch (error: any) {
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}
