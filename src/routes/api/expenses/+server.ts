import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export function GET() {
	const responseBody = {
		status: 'success',
		message: 'response from EXPENSE api'
	};

	return json(responseBody);
}

export async function POST({ request }) {
	try {
		const { name, description, amount, card, userId, type } = await request.json();

		if (!name || !description || !userId || !amount || !type) {
			return json({ status: 'error', message: 'Please enter the required fields' }, { status: 400 });
		}

		const newExpense = await prisma.expense.create({
			data: { name, description, amount, card, userId, type }
		});

		return json(newExpense, { status: 201 });
	} catch (error: any) {
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}