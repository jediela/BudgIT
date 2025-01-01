import { comparePassword } from '$lib/auth/hash';
import { generateAccessToken, generateRefreshToken } from '$lib/auth/jwt';
import { prisma } from '$lib/prisma.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { email, password } = await request.json();

	if (!email || !password) {
		return json(
			{ status: 'error', message: 'Please provide all required fields' },
			{ status: 400 }
		);
	}

	try {
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user || !(await comparePassword(password, user.password))) {
			return json({ status: 'error', message: 'Invalid credentials' }, { status: 401 });
		}

		const accessToken = await generateAccessToken(user.id);
		const refreshToken = await generateRefreshToken(user.id);
		return json(
			{
				status: 'success',
				message: 'Login successful',
				user: { id: user.id, email: user.email, fname: user.fname },
				accessToken,
				refreshToken
			},
			{ status: 200 }
		);
	} catch (error: any) {
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}
