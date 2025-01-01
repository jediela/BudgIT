import { json } from '@sveltejs/kit';

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
	for (const [value] of Object.entries(fields)) {
		if (!value) {
			throw json({ status: 'error', message: 'Please enter the required fields' }, { status: 400 });
		}
	}
}
