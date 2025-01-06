<script lang="ts">
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');

	async function handleLogin(event: Event) {
		event.preventDefault();

		try {
			const res = await fetch('/api/users/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			const data = await res.json();

			goto('/dashboard');

			if (data.status === 'error') {
				throw new Error(data.message);
			}
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
</script>

<div>login</div>
<form onsubmit={handleLogin}>
	<input placeholder="email" bind:value={email} type="text" />
	<input placeholder="password" bind:value={password} type="text" />
	<button type="submit">submit</button>
</form>
