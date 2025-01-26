<script lang="ts">
	import { BarGraph, type BarGraphData } from './BarGraph';
	import { browser } from '$app/environment';

	const { monthData }: { monthData: Record<string, number> } = $props();

	// Assign data directly using monthData
	const data: BarGraphData = [
		{ name: 'January', value: monthData['January'] ?? 0, color: '#ff6b6b' },
		{ name: 'February', value: monthData['February'] ?? 0, color: '#4ecdc4' },
		{ name: 'March', value: monthData['March'] ?? 0, color: '#8e44ad' },
		{ name: 'April', value: monthData['April'] ?? 0, color: '#3498db' },
		{ name: 'May', value: monthData['May'] ?? 0, color: '#1abc9c' },
		{ name: 'June', value: monthData['June'] ?? 0, color: '#f39c12' },
		{ name: 'July', value: monthData['July'] ?? 0, color: '#e74c3c' },
		{ name: 'August', value: monthData['August'] ?? 0, color: '#9b59b6' },
		{ name: 'September', value: monthData['September'] ?? 0, color: '#34495e' },
		{ name: 'October', value: monthData['October'] ?? 0, color: '#16a085' },
		{ name: 'November', value: monthData['November'] ?? 0, color: '#27ae60' },
		{ name: 'December', value: monthData['December'] ?? 0, color: '#2980b9' }
	];

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
