import jwt from 'jsonwebtoken';
import { prisma } from '$lib/prisma';
import { json } from '@sveltejs/kit';

const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

export async function generateAccessToken(userId: number) {
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });
}

export async function generateRefreshToken(userId: number) {
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

export async function authenticate(request: Request) {
	const cookieHeader = request.headers.get('Cookie');
	if (!cookieHeader) {
		return json({ status: 'error', message: 'Cookie header missing' }, { status: 401 });
	}

	const cookies = Object.fromEntries(
		cookieHeader.split('; ').map((cookie) => cookie.split('=').map(decodeURIComponent))
	);
	const token = cookies['refreshToken'];

	if (!token) {
		return json({ status: 'error', message: 'Access token missing in cookies' }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
		const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
		if (!user) {
			return json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
		}
		return user;
	} catch (error: any) {
		if (error.name === 'TokenExpiredError') {
			return json({ status: 'error', message: 'Token expired' }, { status: 401 });
		} else if (error.name === 'JsonWebTokenError') {
			return json({ status: 'error', message: 'Invalid token' }, { status: 401 });
		} else {
			return json({ status: 'error', message: error.message }, { status: 500 });
		}
	}
}
