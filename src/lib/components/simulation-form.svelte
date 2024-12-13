<script lang="ts">
	import Zap from 'lucide-svelte/icons/zap';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	const SCENARIO_TYPE_MAP = {
		'summer peak': 'Summer Peak',
		'winter peak': 'Winter Peak',
		'light load': 'Light Load'
	};

	const FAST_API_BASE_URL = import.meta.env.VITE_FAST_API_BASE_URL;

	let { num_scenarios, scenario_type, start_date, end_date } = $props<{
		num_scenarios?: string;
		scenario_type?: string;
		start_date?: string;
		end_date?: string;
	}>();

	let formData = $state({
		name: '',
		duration: 10,
		num_scenarios: num_scenarios || 3,
		start_time: start_date || null,
		end_time: end_date || null,
		scenario_type: scenario_type || ''
	});

	let result: any;
	let loading = $state(false);
	let error = $state<string | null>(null);

	function resetForm() {
		formData = {
			name: '',
			duration: 10,
			num_scenarios: 3,
			start_time: null,
			end_time: null,
			scenario_type: ''
		};
	}

	function isFormDataFilled() {
		return formData.name && formData.scenario_type && formData.start_time && formData.end_time;
	}

	async function handleSubmit(event: any) {
		event.preventDefault();

		loading = true;
		error = null;

		try {
			const response = await fetch(`${FAST_API_BASE_URL}/start-simulation`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					num_scenarios: formData.num_scenarios,
					scenario_type: formData.scenario_type,
					start_date: formData.start_time,
					end_date: formData.end_time,
					duration: formData.duration,
					name: formData.name
				})
			});

			if (!response.ok) {
				throw new Error(`Failed to create simulation: ${response.statusText}`);
			}

			result = await response.json();
			toast.success('Simulation started', {
				description: 'Your simulation is running. View details of your simulation.',
				action: {
					label: 'View Details',
					onClick: () => goto(`/simulation/${result.id}`)
				}
			});
			resetForm();
		} catch (err) {
			error = (err as Error).message;
			toast.error('Failed to create simulation', {
				description: error
			});
		} finally {
			loading = false;
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-4">
	<fieldset class="grid gap-6 rounded-lg border p-4">
		<legend class="-ml-1 px-1 text-sm font-medium"> Settings </legend>
		<div>
			<Label for="name">Name</Label>
			<Input
				id="name"
				type="text"
				bind:value={formData.name}
				placeholder="Enter simulation name"
				required
			/>
		</div>

		<div>
			<Label for="num_scenarios">Number of Scenarios</Label>
			<Input
				id="num_scenarios"
				type="number"
				bind:value={formData.num_scenarios}
				min="1"
				step="1"
				required
			/>
		</div>

		<div>
			<Label for="scenario_type">Scenario Type</Label>
			<Select.Root
				required
				onSelectedChange={(e: any) => {
					formData.scenario_type = e.value;
				}}
				selected={{
					value: formData.scenario_type,
					label: SCENARIO_TYPE_MAP[formData.scenario_type as keyof typeof SCENARIO_TYPE_MAP]
				}}
			>
				<Select.Trigger class="w-full">
					<Select.Value placeholder="Select scenario type" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="summer peak">Summer Peak</Select.Item>
					<Select.Item value="winter peak">Winter Peak</Select.Item>
					<Select.Item value="light load">Light Load</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>

		<div>
			<Label for="start_time">Start Time</Label>
			<Input id="start_time" type="datetime-local" bind:value={formData.start_time} required />
		</div>

		<div>
			<Label for="end_time">End Time</Label>
			<Input id="end_time" type="datetime-local" bind:value={formData.end_time} required />
		</div>

		<div class="flex flex-col gap-2">
			<div class="flex gap-2">
				<Button type="submit" disabled={loading || !isFormDataFilled()} class="w-full flex-1 gap-2">
					{#if loading}
						<LoaderCircle class="h-4 w-4 animate-spin" />
						Loading...
					{:else}
						<Zap class="h-4 w-4" />
						Start Simulation
					{/if}
				</Button>
				<Input
					id="duration"
					type="number"
					bind:value={formData.duration}
					min="1"
					step="1"
					required
					class="w-[120px]"
				/>
			</div>
			{#if error}
				<p class="text-red-500">{error}</p>
			{/if}
		</div>
	</fieldset>
</form>
