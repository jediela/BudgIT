import { authenticate } from '$lib/auth/jwt';
import { checkAuthorization, findExpenseById } from '$lib/expenses/utils';
import { validateFields, validateId } from '$lib/api/utils';
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
		const { name, description, month, amount, card, type } = await request.json();
		validateFields({ name, amount, type, month });

		const expense = await findExpenseById(Number(id));
		checkAuthorization(expense, user);

		const updatedExpense = await prisma.expense.update({
			where: { id: Number(id) },
			data: { name, description, month, amount, card, userId: user.id, type }
		});

		return json(
			{ status: 'success', message: 'Expense updated successfully', updatedExpense },
			{ status: 200 }
		);
	} catch (error: any) {
		return json({ status: 'error', message: error.message }, { status: 500 });
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
		const expense = await findExpenseById(Number(id));
		checkAuthorization(expense, user);
		await prisma.expense.delete({ where: { id: Number(id) } });
		return json({ status: 'success', message: 'Expense deleted successfully' }, { status: 200 });
	} catch (error: any) {
		return json({ status: 'error', message: error.message }, { status: 500 });
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
        const expense = await findExpenseById(Number(id));
        checkAuthorization(expense, user);
        return json(
			{ status: 'success', message: 'Expense found', expense },
			{ status: 200 }
		);
    } catch (error:any) {
        return json({ status: 'error', message: error.message }, { status: 500 });
    }
}
