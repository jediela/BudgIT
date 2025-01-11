<script lang="ts">
	import { writable } from 'svelte/store';

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

<div>
	<h1>Expenses:</h1>
	{#each expenses as expense}
		<li>
			<strong>{expense.name}</strong> - {expense.month} - ${expense.amount}
		</li>
	{/each}

	<h1>Incomes:</h1>
	{#each incomes as income}
		<li>
			<strong>{income.name}</strong> - {income.month} - ${income.amount}
		</li>
	{/each}

	<h1>Budgets:</h1>
	{#each budgets as budget}
		<li>
			<strong>Type:</strong>
			{budget.type} -
			<strong>Month:</strong>
			{budget.month} -
			<strong>Limit:</strong> ${budget.limit}
		</li>
	{/each}

	<button on:click={() => showModal.set(true)}>Add Expense</button>

	{#if $showModal}
		<div class="modal">
			<div class="modal-content">
				<h2>Add Expense</h2>
				<form on:submit|preventDefault={addExpense}>
					<div>
						<label>Name:</label>
						<input type="text" bind:value={expenseForm.name} required />
					</div>
					<div>
						<label>Description:</label>
						<input type="text" bind:value={expenseForm.description} />
					</div>
					<div>
						<label>Month:</label>
						<select bind:value={expenseForm.month} required>
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
						<label>Amount:</label>
						<input type="number" bind:value={expenseForm.amount} required />
					</div>
					<div>
						<label>Card:</label>
						<input type="text" bind:value={expenseForm.card} />
					</div>
					<div>
						<label>Type:</label>
						<input type="text" bind:value={expenseForm.type} required />
					</div>
					<div class="modal-actions">
						<button type="submit">Add</button>
						<button type="button" on:click={() => showModal.set(false)}>Cancel</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Modal styles */
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	.modal-content {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		width: 90%;
		max-width: 500px;
	}

	form div {
		margin-bottom: 1rem;
	}
	label {
		display: block;
		font-weight: bold;
	}
	input {
		width: 100%;
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid #ccc;
	}
	select {
		width: 100%;
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid #ccc;
	}
	.modal-actions {
		margin-top: 1rem;
		display: flex;
		justify-content: space-between;
	}
</style>
