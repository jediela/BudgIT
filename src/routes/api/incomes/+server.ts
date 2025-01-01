import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { authenticate } from '$lib/auth/jwt.js';

export function GET() {
	const responseBody = {
		status: 'success',
		message: 'response from INCOME api'
	};

	return json(responseBody);
}

export async function POST({ request }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}

	try {
		const { name, description, amount, account, type } = await request.json();

		if (!name || !amount || !type) {
			return json(
				{ status: 'error', message: 'Please enter the required fields' },
				{ status: 400 }
			);
		}

		const newIncome = await prisma.income.create({
			data: { name, description, amount, account, userId: user.id, type }
		});

		return json(newIncome, { status: 201 });
	} catch (error: any) {
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}
