<script lang="ts">
	import { BarGraph, type BarGraphData } from './BarGraph';
	import { browser } from '$app/environment';

	const {
		data = [
			{ name: 'January', value: 88, color: '#ff6b6b' },
			{ name: 'B', value: 42, color: '#4ecdc4' },
			{ name: 'C', value: 58, color: '#45b7d1' },
			{ name: 'D', value: 39, color: '#ff0' },
			{ name: 'E', value: 77, color: '#ffeead' }
		]
	}: { data?: BarGraphData } = $props();

	let displayData = $state(data);

	const changeData = () => {
		const newData = data.map((d) => ({ ...d, value: Math.random() * 100 }));
		displayData = newData;
	};

	let chart: HTMLDivElement;

	let hasSetup = false;

	const { setupGraph, updateGraph } = BarGraph();

	// container size
	let containerDiv: HTMLDivElement;
	let width = $state(0);
	let height = $state(0);

	function updateDimensions() {
		if (containerDiv) {
			width = containerDiv.clientWidth - 60;
			height = width * 0.6 - 50;
		}
	}

	$effect(() => {
		if (browser && containerDiv) {
			updateDimensions();
		}
	});

	$effect(() => {
		if (width > 0 && height > 0) {
			if (!hasSetup) {
				setupGraph(chart, displayData, {
					width,
					height
				});
				hasSetup = true;
			} else {
				updateGraph(displayData);
			}
		}
	});

	// $effect(() => {
	// 	const interval = setInterval(() => {
	// 		changeData();
	// 	}, 2000);

	// 	return () => clearInterval(interval);
	// });
</script>

<div bind:this={containerDiv} class="h-full w-full">
	<div bind:this={chart}></div>
</div>
