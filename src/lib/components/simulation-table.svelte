<script lang="ts">
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import Zap from 'lucide-svelte/icons/zap';
    
	import { Button } from '$lib/components/ui/button/index.js';
	import StatusPill from '$lib/components/status-pill.svelte';
	import * as Table from '$lib/components/ui/table/index.js';

	const SCENARIO_TYPE_MAP = {
		'summer peak': 'Summer Peak',
		'winter peak': 'Winter Peak',
		'light load': 'Light Load'
	};

	export let simulations: any[] = [];
</script>

{#if simulations.length > 0}
	<Table.Root class="w-full">
		<Table.Header>
			<Table.Row>
				<Table.Head class="xl:table.-column">Name</Table.Head>
				<Table.Head class="xl:table.-column">Scenario Type</Table.Head>
				<Table.Head class="xl:table.-column">Created At</Table.Head>
				<Table.Head class="xl:table.-column">Start Date</Table.Head>
				<Table.Head class="xl:table.-column">End Date</Table.Head>
				<Table.Head class="xl:table.-column">Status</Table.Head>
				<Table.Head class="xl:table.-column">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each simulations as simulation}
				<Table.Row>
					<Table.Cell class="xl:table.-column">
						{simulation.name}
					</Table.Cell>
					<Table.Cell class="xl:table.-column">
						{SCENARIO_TYPE_MAP[simulation.scenario_type as keyof typeof SCENARIO_TYPE_MAP]}
					</Table.Cell>
					<Table.Cell>
						{new Date(simulation.created_at).toLocaleDateString()}
					</Table.Cell>
					<Table.Cell class="xl:table.-column">
						{new Date(simulation.start_date).toLocaleDateString()}
					</Table.Cell>
					<Table.Cell class="xl:table.-column">
						{new Date(simulation.end_date).toLocaleDateString()}
					</Table.Cell>
					<Table.Cell class="xl:table.-column">
						<StatusPill status={simulation.status} />
					</Table.Cell>
					<Table.Cell class="xl:table.-column flex items-center justify-end gap-2 text-right">
						<a href={`/simulation/${simulation.id}`}>
							<Button size="sm" type="button" variant="secondary">
								View Details
								<ArrowUpRight class="h-4 w-4" />
							</Button>
						</a>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}

{#if simulations.length === 0}
	<div
		class="mt-3 flex h-[200px] flex-col items-center justify-center gap-3 rounded-md border p-4 text-center text-muted-foreground"
	>
		<p>No simulations found</p>
		<a href="/simulation/create">
			<Button class="flex items-center gap-2">
				<Zap class="h-4 w-4" />
				Start a Simulation
			</Button>
		</a>
	</div>
{/if}
