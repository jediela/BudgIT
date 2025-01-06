<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let email = $state('');
	let password = $state('');
	let fname = $state('');
	let lname = $state('');

	async function handleSignup(event: Event) {
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
		<Card.Title>Create an account</Card.Title>
		<Card.Description>Enter your email below to create your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="email">Email</Label>
					<Input id="email" bind:value={email} placeholder="you@email.com" />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="email">First name</Label>
					<Input id="email" bind:value={fname} placeholder="John" />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="email">Last name</Label>
					<Input id="email" bind:value={lname} placeholder="Doe" />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="password">Password</Label>
					<Input id="password" type="password" bind:value={password} />
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button on:click={handleSignup}>Create account</Button>
		<Card.Description>Already have an account? <a href="/login">Log in here</a></Card.Description>
	</Card.Footer>
</Card.Root>
