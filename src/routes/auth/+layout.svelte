<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './auth/$types';

    let { data, children }: { data: LayoutData, children: Snippet } = $props();
</script>

<div>Auth layout layer</div>
{@render children()}