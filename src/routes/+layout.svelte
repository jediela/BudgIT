<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();
</script>

<Toaster richColors />
<ModeWatcher />
<div class="flex min-h-screen items-center justify-center">
	{@render children()}
</div>
