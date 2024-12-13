<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let data:
		| {
				datetime: Date;
				scenario: number;
				power_MW: number;
		  }[]
		| undefined = undefined;

	export let startDate: Date | null = null;
	export let endDate: Date | null = null;

	let chartCanvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	function renderChart() {
		if (!data || !startDate || !endDate) return;

		const ctx = chartCanvas.getContext('2d');
		if (!ctx) return;

		if (chart) {
			chart.destroy();
		}

		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: generateTimeLabels(startDate, endDate),
				datasets: (() => {
					const colors = [
						'rgb(75, 192, 192)',
						'rgb(192, 75, 192)',
						'rgb(192, 192, 75)',
						'rgb(75, 192, 75)'
					];
					return Array.from(new Set(data.map((item) => item.scenario))).map((scenario, index) => ({
						label: `Simulation Scenario ${scenario} (MW)`,
						data: data.filter((item) => item.scenario === scenario).map((item) => item.power_MW),
						borderColor: colors[index % colors.length],
						tension: 0.1
					}));
				})()
			},
			options: {
				responsive: true,
				layout: {
					padding: 4
				},
				plugins: {
					title: {
						display: true,
						text: 'Simulation Scenarios',
						padding: 32
					},
					legend: {
						position: 'bottom',
						align: 'start',
						labels: {
							boxHeight: 16,
							boxWidth: 16,
							borderRadius: 8,
							useBorderRadius: true
						}
					},
					tooltip: {
						boxHeight: 16,
						boxWidth: 16,
						cornerRadius: 8,
						usePointStyle: true
					}
				},
				scales: {
					y: {
						beginAtZero: false,
						title: {
							display: true,
							text: 'Power (MW)'
						}
					},
					x: {
						title: {
							display: true,
							text: 'Date'
						}
					}
				}
			}
		});
	}

	function generateTimeLabels(start: Date, end: Date): string[] {
		const labels = [];
		const current = new Date(start);
		while (current <= end) {
			labels.push(current.toLocaleDateString());
			current.setDate(current.getDate() + 1); // Move to the next day
		}
		return labels;
	}

	onMount(() => {
		renderChart();
	});
</script>

<div class="chart-container w-full min-h-[400px]">
	<canvas bind:this={chartCanvas}></canvas>
</div>

<style>
	.chart-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}
</style>
