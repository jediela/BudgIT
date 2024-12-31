import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.js';
import { hashPassword } from '$lib/auth/hash.js';

export async function POST({ request }) {
	try {
		// Extract user info from request body
		const { email, fname, lname, password } = await request.json();

		// Validate required fields
		if (!email || !fname || !lname || !password) {
			return json(
				{ status: 'error', message: 'Please enter the required fields' },
				{ status: 400 }
			);
		}

		// Check if user with email exists
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return json({ status: 'error', message: 'Email is already in use' }, { status: 400 });
		}

		// Hash password
		const hashedPassword = await hashPassword(password);

		// Create user
		const newUser = await prisma.user.create({
			data: { email, fname, lname, password: hashedPassword },
			select: {
				id: true,
				email: true,
				fname: true,
				lname: true
			}
		});

		// Return new user without exposing password
		return json({ status: 'success', user: newUser }, { status: 201 });
	} catch (error: any) {
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}
