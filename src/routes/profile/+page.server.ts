export async function load({ fetch }) {
	try {
		const res = await fetch('/api/users/me', { credentials: 'include' });

		const userData = await res.json();
		console.log(userData);
		return { userData };
	} catch (error) {}
}
