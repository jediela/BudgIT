import bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS: number = parseInt(process.env.BCRYPT_SALT_ROUNDS!);

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function comparePassword(password: string, hashedPassword: string) {
	return await bcrypt.compare(password, hashedPassword);
}
