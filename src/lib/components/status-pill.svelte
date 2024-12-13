<script lang="ts">
	export let status: string;

	let statusColor: string;

	$: {
		switch (status) {
			case 'completed':
				statusColor = 'bg-[#E5FAF2] text-[#00974D]';
				break;
			case 'pending':
				statusColor = 'bg-[#FFF6EB] text-[#FF9301]';
				break;
			case 'failed': // this hasnt
				statusColor = 'bg-red-500 text-white';
				break;
			default:
				statusColor = 'bg-gray-500 text-white';
		}
	}
</script>

<span class={`${statusColor} rounded-lg px-2 py-1 text-xs font-medium`}>
	{status.toLocaleUpperCase()}
</span>
