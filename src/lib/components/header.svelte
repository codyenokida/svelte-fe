<script lang="ts">
	let { breadcrumbs, children } = $props<{
		breadcrumbs: { title: string; href: string }[];
		children?: any;
	}>();
</script>

<header
	class="fixed top-0 z-10 flex h-[57px] w-[calc(100%-53px)] items-center justify-between gap-1 border-b bg-background px-4"
>
	<span>
		{#each breadcrumbs.slice(0, -1) as breadcrumb}
			<a href={breadcrumb.href} class="text-sm font-semibold">{breadcrumb.title}</a>
			<span class="mx-2 text-sm">/</span>
		{/each}
		{#if breadcrumbs.length > 0}
			<span class="text-sm">{breadcrumbs[breadcrumbs.length - 1].title}</span>
		{/if}
	</span>
	{#if children}
		{@render children()}
	{/if}
</header>
<div class="h-[57px]"></div>
