<script lang="ts">
	import { writable } from 'svelte/store';
	import { Button } from '$lib/components/ui/button/index.js';

	let { data } = $props();
	const { expenses } = data.props || [];
	const { incomes } = data.props || [];
	const { budgets } = data.props || [];

	const showModal = writable(false);

	let expenseForm = {
		name: '',
		description: '',
		month: '',
		amount: '',
		card: '',
		type: ''
	};

	async function addExpense() {
		try {
			const response = await fetch('/api/expenses', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(expenseForm)
			});

			if (response.ok) {
				const newExpense = await response.json();
				expenses.push(newExpense);
				showModal.set(false);
			} else {
				console.error('Failed to add expense:', await response.json());
			}
		} catch (error) {
			console.error('Error adding expense:', error);
		}
	}
</script>

<div class="space-y-6 p-6">
	<h1 class="text-2xl font-bold">Expenses:</h1>
	<ul class="list-disc pl-6">
		{#each expenses as expense}
			<li>
				<strong>{expense.name}</strong> - {expense.month} - ${expense.amount}
			</li>
		{/each}
	</ul>

	<h1 class="text-2xl font-bold">Incomes:</h1>
	<ul class="list-disc pl-6">
		{#each incomes as income}
			<li>
				<strong>{income.name}</strong> - {income.month} - ${income.amount}
			</li>
		{/each}
	</ul>

	<h1 class="text-2xl font-bold">Budgets:</h1>
	<ul class="list-disc pl-6">
		{#each budgets as budget}
			<li>
				<strong>Type:</strong>
				{budget.type} - <strong>Month:</strong>
				{budget.month} - <strong>Limit:</strong> ${budget.limit}
			</li>
		{/each}
	</ul>

	<Button on:click={() => showModal.set(true)}>Add Expense</Button>

	{#if $showModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-full max-w-md space-y-4 rounded-lg bg-white p-6">
				<h2 class="text-xl font-semibold">Add Expense</h2>
				<form on:submit|preventDefault={addExpense} class="space-y-4">
					<div>
						<label class="mb-1 block font-medium">Name:</label>
						<input
							type="text"
							bind:value={expenseForm.name}
							required
							class="w-full rounded-md border px-4 py-2"
						/>
					</div>
					<div>
						<label class="mb-1 block font-medium">Description:</label>
						<input
							type="text"
							bind:value={expenseForm.description}
							class="w-full rounded-md border px-4 py-2"
						/>
					</div>
					<div>
						<label class="mb-1 block font-medium">Month:</label>
						<select
							bind:value={expenseForm.month}
							required
							class="w-full rounded-md border px-4 py-2"
						>
							<option value="January">January</option>
							<option value="February">February</option>
							<option value="March">March</option>
							<option value="April">April</option>
							<option value="May">May</option>
							<option value="June">June</option>
							<option value="July">July</option>
							<option value="August">August</option>
							<option value="September">September</option>
							<option value="October">October</option>
							<option value="November">November</option>
							<option value="December">December</option>
						</select>
					</div>
					<div>
						<label class="mb-1 block font-medium">Amount:</label>
						<input
							type="number"
							bind:value={expenseForm.amount}
							required
							class="w-full rounded-md border px-4 py-2"
						/>
					</div>
					<div>
						<label class="mb-1 block font-medium">Card:</label>
						<input
							type="text"
							bind:value={expenseForm.card}
							class="w-full rounded-md border px-4 py-2"
						/>
					</div>
					<div>
						<label class="mb-1 block font-medium">Type:</label>
						<input
							type="text"
							bind:value={expenseForm.type}
							required
							class="w-full rounded-md border px-4 py-2"
						/>
					</div>
					<div class="flex justify-between">
						<Button type="submit">Add</Button>
						<Button type="button" on:click={() => showModal.set(false)}>Cancel</Button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
