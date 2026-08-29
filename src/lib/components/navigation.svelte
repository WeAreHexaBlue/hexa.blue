<script lang="ts">
    import { resolve } from "$app/paths";
	import { m } from "$lib/paraglide/messages";

    import logo from "$lib/assets/hexablue.svg";

    import { getLocale, locales, setLocale, type Locale } from "$lib/paraglide/runtime";

    let codeToHuman = {
        en: "English",
        it: "Italiano"
    };
</script>

<nav class="nav">
    <span class="main">
        <a href={resolve("/")} class="brand">
            <img src={logo} class="size-15" alt="HexaBlue Logo" />
            <h1 class="title">{m.hexablue()}</h1>
        </a>
        <span class="links">
            <a href={resolve("/projects")}>{m["nav.projects"]()}</a>
            <a href={resolve("/news")}>{m["nav.news"]()}</a>
        </span>
    </span>
    <select name="lang" class="rounded-md" onchange={(e) => setLocale(e.currentTarget.value as Locale)}>
        {#each locales as locale (locale)}
            <option value={locale} class="bg-neutral-900 text-white" selected={getLocale() === locale}>
                {codeToHuman[locale]}
            </option>
        {/each}
    </select>
</nav>

<style lang="postcss">
	@reference "../../base.css";

    .nav {
        @apply fixed inset-x-0 z-50 mx-auto;
        @apply grid md:flex origin-center items-center md:justify-between justify-items-center gap-5;
        @apply m-8 rounded-xl border border-gray-300 p-4;
        @apply bg-sky-900;

        @apply transition-all duration-300;
    }

    .nav .main {
        @apply flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8;
    }

    .nav .links {
        @apply flex items-center gap-6 text-2xl font-semibold;

        :hover {
            @apply bg-hbcol bg-clip-text text-transparent hbcol-angle-45 hbcol-dark-0%;
        }
    }

    .nav:hover {
        @apply border-white;
        @apply -translate-y-1 drop-shadow-xl;
    }
</style>