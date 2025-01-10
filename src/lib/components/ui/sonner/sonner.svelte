<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner';
	import { mode } from 'mode-watcher';

	type $$Props = SonnerProps;
</script>

<Sonner
	theme={$mode}
	class="toaster group"
	toastOptions={{
		classes: {
			toast:
				'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg text-lg', // Increased text size
			description: 'group-[.toast]:text-muted-foreground text-lg', // Adjust text size here for the description
			actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground text-lg', // Increased button text size
			cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground text-lg' // Increased cancel button text size
		}
	}}
	{...$$restProps}
/>
