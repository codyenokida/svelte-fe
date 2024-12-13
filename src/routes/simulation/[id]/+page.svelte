<script lang="ts">
	import Download from 'lucide-svelte/icons/file-down';
	import Refresh from 'lucide-svelte/icons/refresh-cw';
	import Trash from 'lucide-svelte/icons/trash';
	import Pencil from 'lucide-svelte/icons/pencil';

	import { Button } from '$lib/components/ui/button/index.js';
	import TimeseriesChart from '$lib/components/timeseries-chart.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import StatusPill from '$lib/components/status-pill.svelte';
	import Header from '$lib/components/header.svelte';

	import { onDestroy } from 'svelte';

	let { data } = $props();

	let timeseries = $state(data?.results?.data);
	let status = $state(data?.status);
	let completedAt = $state(new Date(data?.completed_at));

	let startDate = new Date(data?.start_date);
	let endDate = new Date(data?.end_date);

	function downloadToCSV(data: any[], filename: string = 'simulations.csv') {
		const csvContent = data
			.map((sim) =>
				Object.values(sim)
					.map((value) => `"${value}"`)
					.join(',')
			)
			.join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', filename);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	async function fetchData() {
		try {
			const response = await fetch(`/simulation/${data.id}`);
			const result = await response.json();
			const simulation = result.simulation;
			if (simulation.results) {
				timeseries = simulation.results.data;
				status = simulation.status;
				completedAt = new Date(simulation.completed_at);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	// Poll every 5 seconds if data is not available
	const interval = setInterval(() => {
		if (!timeseries) {
			fetchData();
		} else {
			clearInterval(interval);
		}
	}, 5000);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<Header
	breadcrumbs={[
		{ title: 'Dashboard', href: '/' },
		{ title: 'Simulation Details', href: '' }
	]}
/>
<div class="relative flex flex-col overflow-y-scroll">
	<main class="flex flex-1 flex-col gap-4 p-6 md:gap-6 md:p-6">
		<div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
			<div class="flex flex-col gap-1">
				<div class="flex items-center gap-2">
					<h1 class="text-2xl font-semibold">{data.name}</h1>
					<StatusPill {status} />
				</div>
				<p class="text-sm text-muted-foreground">
					Identifier: {data.id}
				</p>
			</div>
			<div class="flex w-full flex-col items-center gap-2 md:w-auto md:flex-row">
				<a
					href={`/simulation/create?num_scenarios=${data.num_scenarios}&start_date=${data.start_date}&end_date=${data.end_date}&scenario_type=${data.scenario_type}`}
				>
					<Button variant="default" class="flex w-full flex-1 gap-2 md:w-auto">
						<Refresh class="h-4 w-4" />
						Re-run Simulation
					</Button>
				</a>
				<a href={`/simulation/create`}>
					<Button variant="default" class="flex w-full flex-1 gap-2 md:w-auto">
						<Pencil class="h-4 w-4" />
						Run with New Parameters
					</Button>
				</a>
			</div>
		</div>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0">
				<div class="grid gap-1">
					<Card.Title>Simulation Details</Card.Title>
					<Card.Description>View the parameters used for this simulation.</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="flex flex-col gap-2">
				<div class="flex items-center gap-2">
					<StatusPill {status} />
				</div>
				<div class="flex flex-col gap-1">
					<p class="text-sm text-muted-foreground">
						<strong>Scenario Type:</strong>
						{data.scenario_type}
					</p>
					<p class="text-sm text-muted-foreground">
						<strong>Start Date:</strong>
						{new Date(data.start_date)}
					</p>
					<p class="text-sm text-muted-foreground">
						<strong>End Date:</strong>
						{new Date(data.end_date)}
					</p>
					<p class="text-sm text-muted-foreground">
						<strong>Created At:</strong>
						{new Date(data.created_at)}
					</p>
					<p class="text-sm text-muted-foreground">
						<strong>Completed At:</strong>
						{new Date(completedAt)}
					</p>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0">
				<div class="grid gap-1">
					<Card.Title>Results</Card.Title>
					<Card.Description>View the results of the simulation.</Card.Description>
				</div>
				<Button
					variant="default"
					class="flex gap-2"
					on:click={() => downloadToCSV(timeseries)}
					disabled={!timeseries}
				>
					<Download class="h-4 w-4" />
					Download Results
				</Button>
			</Card.Header>
			<Card.Content>
				{#if !!timeseries}
					<TimeseriesChart data={timeseries} {endDate} {startDate} />
				{:else}
					<div
						class="flex h-96 w-full animate-pulse flex-col items-center justify-center rounded bg-gray-200"
					>
						<h3 class="text-lg font-semibold">Generating results...</h3>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="min-h-0">
				<Card.Title>Additional Actions</Card.Title>
			</Card.Header>
			<Card.Content>
				<Dialog.Root>
					<Dialog.Trigger>
						<Button variant="destructive" class="flex w-full flex-1 gap-2 md:w-auto">
							<Trash class="h-4 w-4" />
							Delete Simulation
						</Button>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
							<Dialog.Description>
								This action cannot be undone. This will permanently delete this simulation.
							</Dialog.Description>
							<Dialog.Footer>
								<form action="?/deleteSimulation" method="POST">
									<Button
										variant="destructive"
										class="flex w-full flex-1 gap-2 md:w-auto"
										type="submit"
									>
										<Trash class="h-4 w-4" />
										Delete Simulation
									</Button>
								</form>
							</Dialog.Footer>
						</Dialog.Header>
					</Dialog.Content>
				</Dialog.Root>
			</Card.Content>
		</Card.Root>
	</main>
</div>
