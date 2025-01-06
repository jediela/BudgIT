<script lang="ts">
	let { data } = $props();
	const { expenses } = data.props || [];
	const { incomes } = data.props || [];
</script>

<div>
	<h1>Expenses:</h1>
	{#each expenses as expense}
		<li>
			<strong>{expense.name}</strong> - ${expense.amount} (on {expense.month})
		</li>
	{/each}
	<h1>Incomes:</h1>
	{#each incomes as income}
		<li>
			<strong>{income.name}</strong> - ${income.amount} (on {income.month})
		</li>
	{/each}
</div>
