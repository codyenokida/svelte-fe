<script lang="ts">
	import CirclePlay from 'lucide-svelte/icons/circle-play';

	import Header from '$lib/components/header.svelte';
	import SimulationForm from '$lib/components/simulation-form.svelte';
	import * as Card from '$lib/components/ui/card';

	import { page } from '$app/stores';
</script>

<Header
	breadcrumbs={[
		{ title: 'Dashboard', href: '/' },
		{ title: 'Start a Simulation', href: '' }
	]}
/>

<div class="flex min-h-screen flex-col">
	<main class="grid flex-1 gap-4 overflow-auto p-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between">
				<div class="flex items-center justify-center gap-2">
					<CirclePlay class="h-6 w-6 text-[#00974D]" />
					<div class="grid">
						<Card.Title>Start a Simulation</Card.Title>
					</div>
				</div>
			</Card.Header>
			<Card.Content>
				<SimulationForm
					num_scenarios={$page.data.num_scenarios}
					scenario_type={$page.data.scenario_type}
					start_date={$page.data.start_date}
					end_date={$page.data.end_date}
				/>
			</Card.Content>
		</Card.Root>
	</main>
</div>
