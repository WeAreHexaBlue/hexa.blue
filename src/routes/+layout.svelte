<script lang="ts">
	import type { Pathname } from "$app/types";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { locales, localizeHref } from "$lib/paraglide/runtime";
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";

	import Navigation from "$lib/components/navigation.svelte";
	import Footer from "$lib/components/footer.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="min-h-screen flex flex-col">
	<Navigation />
	<div class="flex-1 pt-65 md:pt-40">
		{@render children()}
	</div>
	<Footer />
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
