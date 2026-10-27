<script lang="ts">
	import type { Pathname } from "$app/types";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { locales, localizeHref } from "$lib/paraglide/runtime";
	import { m } from "$lib/paraglide/messages";
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";

	import Navigation from "$lib/components/navigation.svelte";
	import Footer from "$lib/components/footer.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<a href="#content" class="skip">{m["a11y.skip"]()}</a>
<div class="flex flex-col min-h-screen">
	<Navigation />
	<div id="content" class="flex flex-col flex-1 pt-40" tabindex="-1">
		{@render children()}
	</div>
	<Footer />
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>