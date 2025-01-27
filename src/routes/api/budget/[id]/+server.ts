import { authenticate } from '$lib/auth/jwt';
import { prisma } from '$lib/prisma';
import { validateId, checkAuthorization } from '$lib/api/utils';
import { json, type RequestEvent } from '@sveltejs/kit';

// View Budget
export async function GET({ request, params }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}

	const { id } = params;
	validateId(id);

	try {
		const budget = await prisma.budget.findUnique({ where: { id: Number(id) } });

		if (!budget || budget.userId !== user.id) {
			return json(
				{ status: 'error', message: 'Budget not found or unauthorized' },
				{ status: 404 }
			);
		}

		return json(
			{ status: 'success', message: 'Budget retrieved successfully', budget },
			{ status: 200 }
		);
	} catch (error: any) {
		return json(
			{ status: 'error', message: error.message || 'An unknown error occurred' },
			{ status: 500 }
		);
	}
}

// Update Budget
export async function PUT({ request, params }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}

	const { id } = params;
	validateId(id);

	try {
		const { limit, type, date } = await request.json();

		const budget = await prisma.budget.findUnique({ where: { id: Number(id) } });

		if (!budget || budget.userId !== user.id) {
			return json(
				{ status: 'error', message: 'Budget not found or unauthorized' },
				{ status: 404 }
			);
		}

		const formattedDate = new Date(`${date}T00:00:00.000Z`);
		const updatedBudget = await prisma.budget.update({
			where: { id: Number(id) },
			data: { limit, type, date: formattedDate }
		});

		return json(
			{ status: 'success', message: 'Budget updated successfully', updatedBudget },
			{ status: 200 }
		);
	} catch (error: any) {
		return json(
			{ status: 'error', message: error.message || 'An unknown error occurred' },
			{ status: 500 }
		);
	}
}

// Delete Budget
export async function DELETE({ request, params }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}

	const { id } = params;
	validateId(id);

	try {
		// Fetch the budget to check authorization
		const budget = await prisma.budget.findUnique({ where: { id: Number(id) } });

		if (!budget || budget.userId !== user.id) {
			return json(
				{ status: 'error', message: 'Budget not found or unauthorized' },
				{ status: 404 }
			);
		}

		await prisma.budget.delete({ where: { id: Number(id) } });

		return json({ status: 'success', message: 'Budget deleted successfully' }, { status: 200 });
	} catch (error: any) {
		return json(
			{ status: 'error', message: error.message || 'An unknown error occurred' },
			{ status: 500 }
		);
	}
}
