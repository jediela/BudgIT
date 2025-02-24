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
		const { name, description, date, account, type, sortBy, order = 'asc' } = queryParams;

		const filters: any = { userId: user.id };
		if (name) filters.name = { contains: name, mode: 'insensitive' };
		if (description) filters.description = { contains: description, mode: 'insensitive' };
		if (date) filters.date = new Date(date);
		if (account) filters.account = account;
		if (type) filters.type = type;

		const validSortFields = ['name', 'date', 'amount'];
		if (sortBy && !validSortFields.includes(sortBy)) {
			return json({ status: 'error', message: `Invalid sortBy field: ${sortBy}` }, { status: 400 });
		}
		if (order !== 'asc' && order !== 'desc') {
			return json({ status: 'error', message: `Invalid order value: ${order}` }, { status: 400 });
		}

		const incomes = await prisma.income.findMany({
			where: filters,
			orderBy: sortBy ? { [sortBy]: order } : undefined
		});

		return json(
			{
				status: 'success',
				message: 'Income found',
				incomes,
				meta: { total: incomes.length }
			},
			{ status: 200 }
		);
	} catch (error: any) {
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}
