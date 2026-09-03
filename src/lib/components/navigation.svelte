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
            <img src={logo} class="size-10 sm:size-15" alt="HexaBlue Logo" />
            <h1 class="title">{m.hexablue()}</h1>
        </a>
        <span class="links">
            <a href={resolve("/projects")}>{m["nav.projects"]()}</a>
            <a href={resolve("/news")}>{m["nav.news"]()}</a>
            <a href={resolve("/contact")}>{m["nav.contact"]()}</a>
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
        @apply grid sm:flex origin-center items-center sm:justify-between justify-items-center gap-2;
        @apply m-8 rounded-xl border border-gray-300 p-4;
        @apply bg-sky-900;

        @apply transition-all duration-300;
    }

    .nav .main {
        @apply flex flex-col sm:flex-row items-center sm:justify-between gap-1 sm:gap-8;
    }

    .nav .links {
        @apply flex items-center gap-6 text-lg sm:text-2xl font-semibold;

        :hover {
            @apply bg-hbcol bg-clip-text text-transparent hbcol-angle-45 hbcol-dark-0%;
        }
    }

    .nav:hover {
        @apply border-white;
        @apply -translate-y-1 drop-shadow-xl;
    }
</style>