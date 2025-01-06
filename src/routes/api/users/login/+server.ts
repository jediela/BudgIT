import { comparePassword } from '$lib/auth/hash';
import { generateAccessToken, generateRefreshToken } from '$lib/auth/jwt';
import { prisma } from '$lib/prisma.js';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function POST({ request, cookies }: RequestEvent) {
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

		cookies.set('accessToken', accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 15
		});

		cookies.set('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60 * 24 * 7
		});

		return json(
			{
				status: 'success',
				message: 'Login successful',
				user: { id: user.id, email: user.email, fname: user.fname }
			},
			{ status: 200 }
		);
	} catch (error: any) {
		return json({ status: 'error', message: error.message }, { status: 500 });
	}
}
