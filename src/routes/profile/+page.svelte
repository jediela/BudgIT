<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let { data } = $props();
	const { user } = data.userData || [];
	let email = $state(user.email);
	let password = $state(user.password);
	let fname = $state(user.fname);
	let lname = $state(user.lname);

	async function handleUpdate(event: Event) {
		event.preventDefault();
		try {
			const res = await fetch('/api/users/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, fname, lname, password })
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

<Card.Root class="w-[350px]">
	<Card.Header>
		<Card.Title class="text-2xl">Update your profile</Card.Title>
	</Card.Header>
	<Card.Content>
		<form onsubmit={handleUpdate}>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="email">Email</Label>
					<Input id="email" bind:value={email} placeholder="you@email.com" />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="first_name">First name</Label>
					<Input id="first_name" bind:value={fname} placeholder="John" />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="last_name">Last name</Label>
					<Input id="last_name" bind:value={lname} placeholder="Doe" />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="password">Password</Label>
					<Input id="password" type="password" bind:value={password} />
				</div>
			</div>
			<div class="flex justify-center pt-4">
				<Button type="submit">Update</Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
