import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { authenticate } from '$lib/auth/jwt.js';
import { validateFields } from '$lib/api/utils';

export async function GET({ request }: RequestEvent) {
	const user = await authenticate(request);
	if (user instanceof Response) {
		return user;
	}

	try {
		const url = new URL(request.url);
		const queryParams = Object.fromEntries(url.searchParams.entries());
		const { month, type, page = '1', limit = '10', sortBy, order = 'asc' } = queryParams;

		const pageNumber = parseInt(page, 10);
		const limitNumber = parseInt(limit, 10);

		if (isNaN(pageNumber) || pageNumber < 1 || isNaN(limitNumber) || limitNumber < 1) {
			return json({ status: 'error', message: 'Invalid page or limit parameter' }, { status: 400 });
		}

		const filters: any = { userId: user.id };
		if (month) {
			filters.month = month;
		}
		if (type) {
			filters.type = type;
		}

		const validSortFields = ['limit', 'month'];
		if (sortBy && !validSortFields.includes(sortBy)) {
			return json({ status: 'error', message: `Invalid sortBy field: ${sortBy}` }, { status: 400 });
		}
		if (order !== 'asc' && order !== 'desc') {
			return json({ status: 'error', message: `Invalid order value: ${order}` }, { status: 400 });
		}

		const totalBudgets = await prisma.budget.count({ where: filters });
		const totalPages = Math.ceil(totalBudgets / limitNumber);

		if (pageNumber > totalPages) {
			return json(
				{
					status: 'success',
					message: 'No budgets match the criteria',
					budgets: [],
					meta: { total: totalBudgets, page, limit, totalPages }
				},
				{ status: 200 }
			);
		}

		const budgets = await prisma.budget.findMany({
			where: filters,
			orderBy: sortBy ? { [sortBy]: order } : undefined,
			skip: (pageNumber - 1) * limitNumber,
			take: limitNumber
		});

		return json(
			{
				status: 'success',
				message: 'Budgets found',
				budgets,
				meta: {
					total: totalBudgets,
					page: pageNumber,
					limit: limitNumber,
					totalPages
				}
			},
			{ status: 200 }
		);
	} catch (error: any) {
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}

export async function POST({ request }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}

	try {
		const { limit, type, date } = await request.json();
		validateFields({ limit, type, date });
		const formattedDate = new Date(`${date}T00:00:00.000Z`);
		const newBudget = await prisma.budget.create({
			data: { userId: user.id, limit, type, date: formattedDate }
		});

		return json(newBudget, { status: 201 });
	} catch (error: any) {
		if (error instanceof Response) {
			return error;
		}
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}
