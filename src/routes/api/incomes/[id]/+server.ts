import { authenticate } from '$lib/auth/jwt';
import { findIncomeById } from '$lib/incomes/utils';
import { validateFields, validateId, checkAuthorization } from '$lib/api/utils';
import { prisma } from '$lib/prisma';
import { json, type RequestEvent } from '@sveltejs/kit';

// Update
export async function PUT({ request, params }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}
	const { id } = params;
	validateId(id);

	try {
		const { name, description, amount, month, account, type } = await request.json();
		validateFields({ name, amount, type, month });

		const income = await findIncomeById(Number(id));
		checkAuthorization(income, user);

		const updatedIncome = await prisma.income.update({
			where: { id: Number(id) },
			data: { name, description, month, amount, account, userId: user.id, type }
		});

		return json(
			{ status: 'success', message: 'Income updated successfully', updatedIncome },
			{ status: 200 }
		);
	} catch (error: any) {
		if (error instanceof Response) {
			return error;
		}

		if (error.message === 'Income not found') {
			return json({ status: 'error', message: 'Income not found' }, { status: 404 });
		}

		return json(
			{ status: 'error', message: error.message || 'An unknown error occurred' },
			{ status: 500 }
		);
	}
}

// Delete
export async function DELETE({ request, params }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}

	const { id } = params;
	validateId(id);

	try {
		const income = await findIncomeById(Number(id));
		checkAuthorization(income, user);
		await prisma.income.delete({ where: { id: Number(id) } });
		return json({ status: 'success', message: 'Income deleted successfully' }, { status: 200 });
	} catch (error: any) {
		if (error instanceof Response) {
			return error;
		}

		if (error.message === 'Income not found') {
			return json({ status: 'error', message: 'Income not found' }, { status: 404 });
		}

		return json(
			{ status: 'error', message: error.message || 'An unknown error occurred' },
			{ status: 500 }
		);
	}
}

// View
export async function GET({ request, params }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}
	const { id } = params;
	validateId(id);

	try {
		const income = await findIncomeById(Number(id));
		checkAuthorization(income, user);
		return json({ status: 'success', message: 'Income found', income }, { status: 200 });
	} catch (error: any) {
		if (error instanceof Response) {
			return error;
		}

		if (error.message === 'Income not found') {
			return json({ status: 'error', message: 'Income not found' }, { status: 404 });
		}

		return json(
			{ status: 'error', message: error.message || 'An unknown error occurred' },
			{ status: 500 }
		);
	}
}
