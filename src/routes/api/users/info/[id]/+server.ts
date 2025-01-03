import { authenticate } from '$lib/auth/jwt';
import { validateId, checkAuthorization } from '$lib/api/utils';
import { prisma } from '$lib/prisma';
import { json, type RequestEvent } from '@sveltejs/kit';

// Update User
export async function PUT({ request, params }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}

	const { id } = params;
	validateId(id);

	if (user.id !== Number(id)) {
		return json(
			{ status: 'error', message: 'You are not authorized to update this user' },
			{ status: 403 }
		);
	}

	try {
		const { email, fname, lname } = await request.json();
		const updatedUser = await prisma.user.update({
			where: { id: Number(id) },
			data: { email, fname, lname }
		});

		return json(
			{ status: 'success', message: 'User updated successfully', updatedUser },
			{ status: 200 }
		);
	} catch (error: any) {
		return json(
			{ status: 'error', message: error.message || 'An unknown error occurred' },
			{ status: 500 }
		);
	}
}

// Delete User
export async function DELETE({ request, params }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}

	const { id } = params;
	validateId(id);

	if (user.id !== Number(id)) {
		return json(
			{ status: 'error', message: 'You are not authorized to delete this user' },
			{ status: 403 }
		);
	}

	try {
		await prisma.user.delete({ where: { id: Number(id) } });
		return json({ status: 'success', message: 'User deleted successfully' }, { status: 200 });
	} catch (error: any) {
		return json(
			{ status: 'error', message: error.message || 'An unknown error occurred' },
			{ status: 500 }
		);
	}
}

// View User
export async function GET({ request, params }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}

	const { id } = params;
	validateId(id);

	if (user.id !== Number(id)) {
		return json(
			{ status: 'error', message: 'You are not authorized to view this user' },
			{ status: 403 }
		);
	}

	try {
		const userDetails = await prisma.user.findUnique({
			where: { id: Number(id) },
			select: { id: true, email: true, fname: true, lname: true }
		});

		if (!userDetails) {
			return json({ status: 'error', message: 'User not found' }, { status: 404 });
		}

		return json({ status: 'success', message: 'User found', user: userDetails }, { status: 200 });
	} catch (error: any) {
		return json(
			{ status: 'error', message: error.message || 'An unknown error occurred' },
			{ status: 500 }
		);
	}
}
