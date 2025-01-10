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
	let fname = $state('');
	let lname = $state('');
	let submitted = $state(false);

	async function handleSignup(event: Event) {
		event.preventDefault();
		if (!email || !fname || !lname || !password) {
			submitted = true;
			toast.error('Please fill in the required fields', { duration: 2000, position: 'top-center' });
			return;
		}

		try {
			const res = await fetch('/api/users/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, fname, lname, password })
			});

			if (!res.ok) {
				const data = await res.json();
				toast.error(data.message, {
					duration: 2000,
					position: 'top-center'
				});
				return;
			}
			await loginUser(email, password);
		} catch (error: any) {
			toast.error(error.message);
		}
	}

	async function loginUser(email: string, password: string) {
		try {
			const res = await fetch('/api/users/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (!res.ok) {
				toast.error('An error occurred', { duration: 2000, position: 'top-center' });
				return;
			}
			goto('/dashboard');
		} catch (error: any) {
			toast.error(error.message);
		}
	}
</script>

<Card.Root class="lg:w-1/3">
	<Card.Header>
		<Card.Title class="text-2xl">Create an account</Card.Title>
		<Card.Description>Enter your email below to create your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form onsubmit={handleSignup}>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="email">Email <span class="text-red-500">*</span></Label>
					<Input
						class={`border focus:outline-none ${submitted && !email ? 'ring-2 ring-red-500' : ''}`}
						id="email"
						bind:value={email}
						placeholder="you@email.com"
					/>
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="first_name">First name <span class="text-red-500">*</span></Label>
					<Input
						class={`border focus:outline-none ${submitted && !fname ? 'ring-2 ring-red-500' : ''}`}
						id="first_name"
						bind:value={fname}
						placeholder="John"
					/>
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="last_name">Last name <span class="text-red-500">*</span></Label>
					<Input
						class={`border focus:outline-none ${submitted && !lname ? 'ring-2 ring-red-500' : ''}`}
						id="last_name"
						bind:value={lname}
						placeholder="Doe"
					/>
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="password">Password <span class="text-red-500">*</span></Label>
					<Input
						class={`border focus:outline-none ${submitted && !password ? 'ring-2 ring-red-500' : ''}`}
						id="password"
						type="password"
						bind:value={password}
					/>
				</div>
			</div>
			<div class="flex justify-center pt-4">
				<Button type="submit">Create account</Button>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex flex-col justify-between space-y-4">
		<Separator />
		<Card.Description
			>Already have an account? <a href="/auth/login" class="underline">Log in here</a>
		</Card.Description>
	</Card.Footer>
</Card.Root>
