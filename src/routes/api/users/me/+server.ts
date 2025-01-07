import { authenticate } from '$lib/auth/jwt';
import { validateFields, validateId } from '$lib/api/utils';
import { prisma } from '$lib/prisma';
import { json, type RequestEvent } from '@sveltejs/kit';
import { hashPassword } from '$lib/auth/hash';

// Update User
export async function PUT({ request }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}

	const id = user.id;

	try {
		const { email, fname, lname, password } = await request.json();
		validateFields({ email, fname, lname, password });
		const hashedPassword = await hashPassword(password);
		const updatedUser = await prisma.user.update({
			where: { id: Number(id) },
			data: { email, fname, lname, password: hashedPassword }
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
export async function DELETE({ request }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}

	const id = user.id;

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
export async function GET({ request }: RequestEvent) {
	const user = await authenticate(request);

	if (user instanceof Response) {
		return user;
	}

	const id = user.id;

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
