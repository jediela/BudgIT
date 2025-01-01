import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { authenticate } from '$lib/auth/jwt.js';
import { validateFields } from '$lib/api/utils';

export function GET() {
	const responseBody = {
		status: 'success',
		message: 'response from EXPENSE api'
	};

	return json(responseBody);
}

export async function POST({ request }: RequestEvent) {
	const user = await authenticate(request);

	// user will return a response if error occurs]
	if (user instanceof Response) {
		return user;
	}

	try {
		const { name, description, amount, card, type } = await request.json();
		validateFields({ name, amount, type });

		const newExpense = await prisma.expense.create({
			data: { name, description, amount, card, userId: user.id, type }
		});

		return json(newExpense, { status: 201 });
	} catch (error: any) {
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}
