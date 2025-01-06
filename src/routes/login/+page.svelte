<!-- <script lang="ts">
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
</form> -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	
</script>

<Card.Root class="w-[350px]">
	<Card.Header>
		<Card.Title>Create project</Card.Title>
		<Card.Description>Deploy your new project in one-click.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="name">Name</Label>
					<Input id="name" placeholder="Name of your project" />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="framework">Framework</Label>
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button variant="outline">Cancel</Button>
		<Button>Deploy</Button>
	</Card.Footer>
</Card.Root>
