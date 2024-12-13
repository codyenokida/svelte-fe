<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { page } from '$app/stores';
	import '../app.css';

	let { children } = $props();

	let path = $state('');

	function getPath(currentPath: string) {
		path = currentPath;
	}

	$effect(() => {
		getPath($page.url.pathname);
	});

	import Home from 'lucide-svelte/icons/home';
	import BookOpen from 'lucide-svelte/icons/book-open';
	import BadgePlus from 'lucide-svelte/icons/badge-plus';
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import SquareUser from 'lucide-svelte/icons/square-user';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
</script>

<div class="h-screen w-full pl-[53px]">
	<aside class="inset-y fixed left-0 z-20 flex h-full flex-col border-r bg-[#F5F7F9]">
		<div class="border-b p-2">
			<a href="/">
				<Button variant="outline" size="icon" aria-label="Home">
					<img src="/logo.png" alt="Logo" class="h-4 w-5" />
				</Button>
			</a>
		</div>
		<nav class="grid gap-1 p-2">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a href="/">
						<Button
							variant="ghost"
							size="icon"
							class={`rounded-lg ${path === '/' ? 'bg-white' : ''}`}
							aria-label="Dashboard"
							builders={[builder]}
						>
							<Home class="size-5" />
						</Button>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right" sideOffset={5}>Dashboard</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a href="/simulation/create">
						<Button
							variant="ghost"
							size="icon"
							class={`rounded-lg ${path === '/simulation/create' ? 'bg-white' : ''}`}
							aria-label="Create Simulation"
							builders={[builder]}
						>
							<BadgePlus class="size-5" />
						</Button>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right" sideOffset={5}>Create Simulation</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a href="/simulation/history">
						<Button
							variant="ghost"
							size="icon"
							class={`rounded-lg ${path === '/simulation/history' ? 'bg-white' : ''}`}
							aria-label="Simulation History"
							builders={[builder]}
						>
							<BookOpen class="size-5" />
						</Button>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right" sideOffset={5}>Simulation History</Tooltip.Content>
			</Tooltip.Root>
		</nav>
		<nav class="mt-auto grid gap-1 p-2">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						variant="ghost"
						size="icon"
						class="mt-auto rounded-lg"
						aria-label="Help"
						builders={[builder]}
					>
						<LifeBuoy class="size-5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="right" sideOffset={5}>Help</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						variant="ghost"
						size="icon"
						class="mt-auto rounded-lg"
						aria-label="Account"
						builders={[builder]}
					>
						<SquareUser class="size-5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="right" sideOffset={5}>Account</Tooltip.Content>
			</Tooltip.Root>
		</nav>
	</aside>
	<Toaster />
	{@render children()}
</div>
