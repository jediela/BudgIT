<script lang="ts">
	import { Button } from './ui/button';

	export let title: string;
	export let formData: any;
	export let onSubmit: (event: Event) => void;
	export let onCancel: () => void;
	export let submitLabel: string = 'Submit';
	export let cancelLabel: string = 'Cancel';
	export let types: string[] = [];
	export let submitted: boolean;
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
	<div class="w-full max-w-md space-y-4 rounded-lg bg-secondary p-6">
		<h2 class="text-xl font-semibold">{title}</h2>
		<form on:submit={onSubmit} class="space-y-4" novalidate>
			<div>
				<label for="name" class="mb-1 block font-medium">Name:</label>
				<input
					id="name"
					type="text"
					bind:value={formData.name}
					required
					class="w-full rounded-md border px-3 py-2 {submitted && !formData.name
						? 'border-red-500'
						: ''}"
				/>
			</div>
			<div>
				<label for="description" class="mb-1 block font-medium">Description:</label>
				<input
					id="description"
					type="text"
					bind:value={formData.description}
					class="w-full rounded-md border px-3 py-2"
				/>
			</div>
			<div>
				<label for="month" class="mb-1 block font-medium">Month:</label>
				<select
					id="month"
					bind:value={formData.month}
					required
					class="w-full rounded-md border px-3 py-2 {submitted && !formData.month
						? 'border-red-500'
						: ''}"
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
				<label for="amount" class="mb-1 block font-medium">Amount:</label>
				<div class="relative">
					<span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-300">$</span>
					<input
						id="amount"
						type="number"
						step="0.01"
						min="0"
						bind:value={formData.amount}
						required
						class="w-full rounded-md border py-2 pl-8 {submitted && !formData.amount
							? 'border-red-500'
							: ''}"
					/>
				</div>
			</div>
			<div>
				<label for="account" class="mb-1 block font-medium">Account/Card:</label>
				<input
					id="account"
					type="text"
					bind:value={formData.account}
					class="w-full rounded-md border px-3 py-2"
				/>
			</div>
			<div>
				<label for="type" class="mb-1 block font-medium">Type:</label>
				<select
					id="type"
					bind:value={formData.type}
					required
					class="w-full rounded-md border px-3 py-2 {submitted && !formData.type
						? 'border-red-500'
						: ''}"
				>
					{#each types as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
			</div>
			<div class="mt-4 flex justify-between">
				<Button type="button" on:click={onCancel}>{cancelLabel}</Button>
				<Button type="submit">{submitLabel}</Button>
			</div>
		</form>
	</div>
</div>
