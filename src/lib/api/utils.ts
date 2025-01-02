import { json } from '@sveltejs/kit';
import type { User } from '@prisma/client';

/**
 * Validates if the given ID is a valid number.
 */
export function validateId(id: string | undefined) {
	if (!id || isNaN(Number(id))) {
		throw json({ status: 'error', message: 'Invalid ID' }, { status: 400 });
	}
}

/**
 * Validates required fields in a request payload.
 */
export function validateFields(fields: Record<string, any>) {
	for (const [key, value] of Object.entries(fields)) {
		console.log(value);
		if (!value) {
			console.log("missing field");
			throw json({ status: 'error', message: 'Please enter the required fields', missingKey: key }, { status: 400 });
		}
	}
}

/**
 * Checks if the user is authorized to access/modify the given income/expense.
 */
export function checkAuthorization(item: { userId: number }, user: User) {
	if (item.userId !== user.id) {
		throw json(
			{ status: 'error', message: 'Unauthorized, you do not have access to this expense' },
			{ status: 403 }
		);
	}
}
