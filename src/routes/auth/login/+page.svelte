<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { toast } from 'svelte-sonner';

	let email = $state('');
	let password = $state('');

	async function handleLogin(event: Event) {
		event.preventDefault();

		try {
			if (email === '' || password === '') {
				toast.error('Please fill in the required fields', {
					duration: 2000,
					position: 'top-center'
				});
				return;
			}

			const res = await fetch('/api/users/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			const data = await res.json();

			if (!res.ok) {
				email = '';
				password = '';
				toast.error('Invalid Credentials', { duration: 2000, position: 'top-center' });
				return;
			}

			goto('/dashboard');
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
</script>

<Card.Root class="lg:w-1/3">
	<Card.Header>
		<Card.Title class="text-2xl">Login to BudgIT</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form onsubmit={handleLogin}>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="email">Email</Label>
					<Input id="email" bind:value={email} />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="password">Password</Label>
					<Input id="password" type="password" bind:value={password} />
				</div>
			</div>
			<div class="flex justify-center pt-4">
				<Button type="submit">Log in</Button>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex flex-col justify-between space-y-4">
		<Separator />
		<Card.Description
			>Don't have an account? <a href="/auth/signup" class="underline">Sign up</a></Card.Description
		>
	</Card.Footer>
</Card.Root>
