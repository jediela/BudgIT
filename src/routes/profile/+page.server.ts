export async function load({ fetch }) {
	try {
		const res = await fetch('/api/users/me', { credentials: 'include' });

		if (!res.ok) {
			throw new Error('Failed to fetch user data');
		}

		const userData = await res.json();
		return { userData };
	} catch (error) {
		console.error('Error fetching data:', error);
		return { userData: {} };
	}
}
