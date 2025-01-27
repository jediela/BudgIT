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
			date,
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
		if (date) {
			const formattedDate = new Date(date);
			if (isNaN(formattedDate.getTime())) {
				return json({ status: 'error', message: 'Invalid date format' }, { status: 400 });
			}
			filters.date = formattedDate;
		}
		if (card) {
			filters.card = card;
		}
		if (type) {
			filters.type = type;
		}

		const validSortFields = ['name', 'date', 'amount'];
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
					meta: {
						total: totalExpenses,
						page: pageNumber,
						limit: limitNumber,
						totalPages: Math.ceil(totalExpenses / limitNumber)
					}
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
				meta: { total: totalExpenses, page: pageNumber, limit: limitNumber, totalPages }
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
		const { name, description, date, amount, card, type } = await request.json();

		validateFields({ name, amount, type, date });

		const formattedDate = new Date(`${date}T00:00:00.000Z`);
		const newExpense = await prisma.expense.create({
			data: { name, description, date: formattedDate, amount, card, userId: user.id, type }
		});

		return json(newExpense, { status: 201 });
	} catch (error: any) {
		if (error instanceof Response) {
			return error;
		}
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}
