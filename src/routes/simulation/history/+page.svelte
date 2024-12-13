<script lang="ts">
	import Newspaper from 'lucide-svelte/icons/newspaper';
	import Zap from 'lucide-svelte/icons/zap';

	import * as Card from '$lib/components/ui/card/index.js';
	import SimulationTable from '$lib/components/simulation-table.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Header from '$lib/components/header.svelte';

	import { onDestroy, onMount } from 'svelte';

	let { data } = $props();
	let simulations = $state(data.simulations);
	let searchQuery = $state('');
	let selectedScenarioType = $state('');

	const SCENARIO_TYPE_OPTIONS = ['All Scenario Types', 'Summer Peak', 'Winter Peak', 'Light Load'];

	function filterSimulations(simulations: any[], query: string, scenarioType: string) {
		return simulations.filter((sim) => {
			const matchesSearch = sim.name.toLowerCase().includes(query.toLowerCase());
			const matchesType =
				!scenarioType ||
				scenarioType === 'All Scenario Types' ||
				sim.scenario_type === scenarioType.toLowerCase();
			return matchesSearch && matchesType;
		});
	}

	const filteredSimulations = $derived(
		filterSimulations(simulations, searchQuery, selectedScenarioType)
	);

	async function fetchData() {
		const response = await fetch(`/simulations`);
		const result = await response.json();
		simulations = result.simulations;
	}

	// Poll every 5 seconds
	const interval = setInterval(fetchData, 5000);

	// Clean up interval when the component is destroyed
	onDestroy(() => {
		clearInterval(interval);
	});

	onMount(() => {
		fetchData();
	});
</script>

<Header
	breadcrumbs={[
		{ title: 'Dashboard', href: '/' },
		{ title: 'Simulation History', href: '' }
	]}
>
	<Button size="sm" type="button" class="flex items-center gap-2">
		<Zap class="h-4 w-4" />
		Start New Simulation
	</Button>
</Header>

<div class="flex flex-col">
	<main class="grid flex-1 gap-4 overflow-auto p-4">
		<Card.Root class="overflow-x-scroll xl:col-span-2">
			<Card.Header class="flex flex-row items-center justify-between">
				<div class="flex items-center justify-center gap-2">
					<Newspaper class="h-6 w-6 text-[#00974D]" />
					<div class="grid">
						<Card.Title>All Simulations</Card.Title>
					</div>
				</div>
				<div class="flex gap-2">
					<Input
						type="text"
						placeholder="Search by name"
						bind:value={searchQuery}
						class="rounded border px-2 py-1"
					/>
					<Select.Root
						onSelectedChange={(e: any) => {
							selectedScenarioType = e.value;
						}}
					>
						<Select.Trigger class="rounded border px-2 py-1 text-sm">
							{selectedScenarioType || 'All Scenario Types'}
						</Select.Trigger>
						<Select.Content>
							{#each SCENARIO_TYPE_OPTIONS as option}
								<Select.Item value={option}>{option}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</Card.Header>
			<Card.Content>
				<SimulationTable simulations={filteredSimulations} />
			</Card.Content>
		</Card.Root>
	</main>
</div>
