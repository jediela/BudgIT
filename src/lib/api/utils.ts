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
	const missingKeys: string[] = [];
	for (const [key, value] of Object.entries(fields)) {
		if (value === null || value === undefined || value === '') {
			missingKeys.push(key);
		}
	}
	if (missingKeys.length > 0) {
		throw json(
			{ status: 'error', message: 'Please enter the required fields', missingKeys: missingKeys },
			{ status: 400 }
		);
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
