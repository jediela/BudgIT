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
		const {
			name,
			description,
			month,
			card,
			type,
			page = '1',
			limit = '10',
			sortBy,
			order = 'asc'
		} = queryParams;

		const pageNumber = parseInt(page, 10);
		const limitNumber = parseInt(limit, 10);

		if (isNaN(pageNumber) || pageNumber < 1 || isNaN(limitNumber) || limitNumber < 1) {
			return json({ status: 'error', message: 'Invalid page or limit parameter' }, { status: 400 });
		}

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

		const totalExpenses = await prisma.expense.count({ where: filters });
		const totalPages = Math.ceil(totalExpenses / limitNumber);

		if (pageNumber > totalPages) {
			return json(
				{
					status: 'success',
					message: 'No expenses match the criteria',
					expenses: [],
					meta: { total: totalExpenses, page, limit, totalPages }
				},
				{ status: 200 }
			);
		}

		const expenses = await prisma.expense.findMany({
			where: filters,
			orderBy: sortBy ? { [sortBy]: order } : undefined,
			skip: (pageNumber - 1) * limitNumber,
			take: limitNumber
		});

		return json(
			{
				status: 'success',
				message: 'Expenses found',
				expenses,
				meta: {
					total: totalExpenses,
					page: pageNumber,
					limit: limitNumber,
					totalPages: Math.ceil(totalExpenses / limitNumber)
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

	// user will return a response if error occurs
	if (user instanceof Response) {
		return user;
	}

	try {
		const { name, description, month, amount, card, type } = await request.json();
		validateFields({ name, amount, type, month });
		const newExpense = await prisma.expense.create({
			data: { name, description, month, amount, card, userId: user.id, type }
		});

		return json(newExpense, { status: 201 });
	} catch (error: any) {
		if (error instanceof Response) {
			return error;
		}
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}
