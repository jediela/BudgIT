<script lang="ts">
	import type { PageData } from './login/$types';
	let { data }: { data: PageData } = $props();

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

			if (data.status === 'error') {
				throw new Error(data.message);
			}

            localStorage.setItem('refreshToken', data.refreshToken); 
            window.location.href = '/dashboard'; // Change this URL as needed

		} catch (error) {}
	}
</script>

<div>login</div>
<form onsubmit={handleLogin}>
	<input placeholder="email" bind:value={email} type="text" />
	<input placeholder="password" bind:value={password} type="text" />
	<button type="submit">submit</button>
</form>
