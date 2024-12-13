<script lang="ts">
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import PlayCircle from 'lucide-svelte/icons/play-circle';
	import Newspaper from 'lucide-svelte/icons/newspaper';

	import { Button } from '$lib/components/ui/button/index.js';
	import SimulationTable from '$lib/components/simulation-table.svelte';
	import SimulationForm from '$lib/components/simulation-form.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Header from '$lib/components/header.svelte';

	import { onDestroy, onMount } from 'svelte';

	let { data } = $props();
	let simulations = $state(data.simulations);

	const sortedSimulations = $derived(
		[...simulations].sort(
			(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		)
	);

	async function fetchData() {
		try {
			const response = await fetch(`/`);
			const result = await response.json();
			simulations = result.simulations;
		} catch (error) {
			console.error('Error fetching simulations:', error);
		}
	}

	// Poll every 5 seconds
	const interval = setInterval(fetchData, 5000);

	// Clean up interval when the component is destroyed
	onDestroy(() => {
		clearInterval(interval);
	});

	// Initial fetch
	onMount(() => {
		fetchData();
	});
</script>

<Header breadcrumbs={[{ title: 'Dashboard', href: '/' }]} />

<div class="relative flex flex-col overflow-y-scroll">
	<div class="flex w-full flex-1 flex-col">
		<main class="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
			<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
				<Card.Root class="overflow-x-scroll xl:col-span-1">
					<Card.Header class="flex flex-row items-center">
						<div class="flex items-center justify-center gap-2">
							<PlayCircle class="h-6 w-6 text-[#00974D]" />
							<div class="grid">
								<Card.Title>Start a Simulation</Card.Title>
							</div>
						</div>
					</Card.Header>
					<Card.Content>
						<SimulationForm />
					</Card.Content>
				</Card.Root>
				<Card.Root class="overflow-x-scroll md:col-span-2">
					<Card.Header class="flex flex-row items-center">
						<div class="flex items-center justify-center gap-2">
							<Newspaper class="h-6 w-6 text-[#00974D]" />
							<div class="grid">
								<Card.Title>Recent Simulations</Card.Title>
							</div>
						</div>
						<a href="/simulation/history" class="ml-auto mt-0">
							<Button size="sm" type="button" class="flex items-center gap-2" variant="outline">
								<ArrowUpRight class="h-4 w-4" />
								View All
							</Button>
						</a>
					</Card.Header>
					<Card.Content>
						<SimulationTable simulations={sortedSimulations} />
					</Card.Content>
				</Card.Root>
			</div>
		</main>
	</div>
</div>
