<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ExpenseTypes } from '@prisma/client';
	import { IncomeTypes } from '@prisma/client';
	import Modal from '$lib/components/Modal.svelte';
	import { toast } from 'svelte-sonner';
	import BarChart from '$lib/components/graph/BarChart.svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';

	let value = $state(today(getLocalTimeZone()));
	let x = 0;
	let { data } = $props();
	let { expenses, incomes, budgets, monthIncomes, monthExpenses } = $state(
		data.props || {
			expenses: [],
			incomes: [],
			budgets: [],
			monthIncomes: {},
			monthExpenses: {}
		}
	);

	let showExpenseModal = $state(false);
	let showIncomeModal = $state(false);
	let submittedExpense = $state(false);
	let submittedIncome = $state(false);

	let expenseForm = $state({
		name: '',
		description: '',
		date: '',
		amount: '',
		account: '',
		type: ''
	});

	let incomeForm = $state({
		name: '',
		description: '',
		date: '',
		amount: '',
		account: '',
		type: ''
	});

	const expenseTypes = Object.values(ExpenseTypes);
	const incomeTypes = Object.values(IncomeTypes);

	async function addExpense(e: Event) {
		e.preventDefault();

		let hasError = false;

		if (!expenseForm.name || !expenseForm.date || !expenseForm.amount) {
			hasError = true;
			submittedExpense = true;
			toast.error('Please fill in the required fields', { duration: 2000, position: 'top-center' });
		}

		if (hasError) return;

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
				expenses = [...expenses, newExpense];
				showExpenseModal = false;
				expenseForm = {
					name: '',
					description: '',
					date: '',
					amount: '',
					account: '',
					type: ''
				};
				submittedExpense = false;
				monthExpenses[newExpense.date] =
					(monthExpenses[newExpense.date] || 0) + parseFloat(newExpense.amount);
			} else {
				console.error('Failed to add expense:', await response.json());
			}
		} catch (error) {
			console.error('Error adding expense:', error);
		}
	}

	async function addIncome(e: Event) {
		e.preventDefault();
		let hasError = false;

		if (!incomeForm.name || !incomeForm.date || !incomeForm.amount) {
			hasError = true;
			submittedIncome = true;
			toast.error('Please fill in the required fields', { duration: 2000, position: 'top-center' });
		}

		if (hasError) return;

		try {
			const response = await fetch('/api/incomes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(incomeForm)
			});

			if (response.ok) {
				const newIncome = await response.json();
				incomes = [...incomes, newIncome];
				showIncomeModal = false;
				incomeForm = {
					name: '',
					description: '',
					date: '',
					amount: '',
					account: '',
					type: ''
				};
				submittedIncome = false;
				monthIncomes[newIncome.date] =
					(monthIncomes[newIncome.date] || 0) + parseFloat(newIncome.amount);
			} else {
				console.error('Failed to add income:', await response.json());
			}
		} catch (error) {
			console.error('Error adding income:', error);
		}
	}

	function cancelExpenseModal() {
		showExpenseModal = false;
		expenseForm = {
			name: '',
			description: '',
			date: '',
			amount: '',
			account: '',
			type: ''
		};
		submittedExpense = false;
	}

	function cancelIncomeModal() {
		showIncomeModal = false;
		incomeForm = {
			name: '',
			description: '',
			date: '',
			amount: '',
			account: '',
			type: ''
		};
		submittedIncome = false;
	}
</script>

<Calendar bind:value class="rounded-md border shadow" />

<h1>MONTHLY INCOME TOTALS</h1>
<ul>
	{#each Object.keys(monthIncomes) as month}
		<li>
			{month}: <span class="text-green-500">${monthIncomes[month]}</span>
		</li>
	{/each}
</ul>

<h1>MONTHLY EXPENSE TOTALS</h1>
<ul>
	{#each Object.keys(monthExpenses) as month}
		<li>
			{month}: <span class="text-red-500">${monthExpenses[month]}</span>
		</li>
	{/each}
</ul>

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
			formData={expenseForm}
			onSubmit={addExpense}
			onCancel={cancelExpenseModal}
			submitLabel="Add"
			cancelLabel="Cancel"
			types={expenseTypes}
			submitted={submittedExpense}
		/>
	{/if}

	{#if showIncomeModal}
		<Modal
			title="Add Income"
			formData={incomeForm}
			onSubmit={addIncome}
			onCancel={cancelIncomeModal}
			submitLabel="Add"
			cancelLabel="Cancel"
			types={incomeTypes}
			submitted={submittedIncome}
		/>
	{/if}
</div>

<BarChart monthData={monthIncomes} />
