<script lang="ts">
	import { writable } from 'svelte/store';
	import { Button } from '$lib/components/ui/button/index.js';
	import Modal from '$lib/components/Modal.svelte';

	let { data } = $props();

	let { expenses } = $state(data.props || []);
	let { incomes } = $state(data.props || []);
	const { budgets } = $state(data.props || []);

	let showExpenseModal = $state(false);
	let showIncomeModal = $state(false);

	let expenseForm = writable({
		name: '',
		description: '',
		month: '',
		amount: '',
		account: '',
		type: ''
	});

	let incomeForm = writable({
		name: '',
		description: '',
		month: '',
		amount: '',
		account: '',
		type: ''
	});

	async function addExpense(e: Event) {
		e.preventDefault();
		try {
			const response = await fetch('/api/expenses', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify($expenseForm)
			});

			if (response.ok) {
				const newExpense = await response.json();

				expenses = [...expenses, newExpense];
				showExpenseModal = false;
				expenseForm.set({
					name: '',
					description: '',
					month: '',
					amount: '',
					account: '',
					type: ''
				});
			} else {
				console.error('Failed to add expense:', await response.json());
			}
		} catch (error) {
			console.error('Error adding expense:', error);
		}
	}

	async function addIncome(e: Event) {
		e.preventDefault();
		try {
			const response = await fetch('/api/incomes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify($incomeForm)
			});

			if (response.ok) {
				const newIncome = await response.json();

				incomes = [...incomes, newIncome];
				showIncomeModal = false;
				incomeForm.set({
					name: '',
					description: '',
					month: '',
					amount: '',
					account: '',
					type: ''
				});
			} else {
				console.error('Failed to add income:', await response.json());
			}
		} catch (error) {
			console.error('Error adding income:', error);
		}
	}

	function cancelExpenseModal() {
		showExpenseModal = false;
		expenseForm.set({
			name: '',
			description: '',
			month: '',
			amount: '',
			account: '',
			type: ''
		});
	}

	function cancelIncomeModal() {
		showIncomeModal = false;
		incomeForm.set({
			name: '',
			description: '',
			month: '',
			amount: '',
			account: '',
			type: ''
		});
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

	<Button on:click={() => (showExpenseModal = true)}>Add Expense</Button>
	<Button on:click={() => (showIncomeModal = true)}>Add Income</Button>

	{#if showExpenseModal}
		<Modal
			title="Add Expense"
			formData={$expenseForm}
			onSubmit={addExpense}
			onCancel={cancelExpenseModal}
			submitLabel="Add"
			cancelLabel="Cancel"
		/>
	{/if}

	{#if showIncomeModal}
		<Modal
			title="Add Income"
			formData={$incomeForm}
			onSubmit={addIncome}
			onCancel={cancelIncomeModal}
			submitLabel="Add"
			cancelLabel="Cancel"
		/>
	{/if}
</div>
