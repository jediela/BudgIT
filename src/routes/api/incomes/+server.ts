import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { authenticate } from '$lib/auth/jwt.js';
import { validateFields } from '$lib/api/utils';

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
		const { name, description, month, amount, account, type } = await request.json();
		validateFields({ name, amount, type, month });
		const newIncome = await prisma.income.create({
			data: { name, description, month, amount, account, userId: user.id, type }
		});

		return json(newIncome, { status: 201 });
	} catch (error: any) {
		if (error instanceof Response) {
			return error;
		}
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}
