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
			account,
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
			filters.date = new Date(date);
		}
		if (account) {
			filters.account = account;
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

		const totalIncome = await prisma.income.count({ where: filters });
		const totalPages = Math.ceil(totalIncome / limitNumber);

		if (pageNumber > totalPages) {
			return json(
				{
					status: 'success',
					message: 'No income matches the criteria',
					incomes: [],
					meta: { total: totalIncome, page, limit, totalPages }
				},
				{ status: 200 }
			);
		}

		const incomes = await prisma.income.findMany({
			where: filters,
			orderBy: sortBy ? { [sortBy]: order } : undefined,
			skip: (pageNumber - 1) * limitNumber,
			take: limitNumber
		});

		return json(
			{
				status: 'success',
				message: 'Income found',
				incomes,
				meta: {
					total: totalIncome,
					page: pageNumber,
					limit: limitNumber,
					totalPages: Math.ceil(totalIncome / limitNumber)
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
		const { name, description, date, amount, account, type } = await request.json();
		validateFields({ name, amount, type, date });
		const formattedDate = new Date(`${date}T00:00:00.000Z`);
		const newIncome = await prisma.income.create({
			data: { name, description, date: formattedDate, amount, account, userId: user.id, type }
		});

		return json(newIncome, { status: 201 });
	} catch (error: any) {
		if (error instanceof Response) {
			return error;
		}
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}
