<script lang="ts">
    import { resolve } from "$app/paths";
	import { m } from "$lib/paraglide/messages";

    import logo from "$lib/assets/hexablue.svg";

    import { getLocale, locales, setLocale, type Locale } from "$lib/paraglide/runtime";

    let codeToHuman = {
        en: "English",
        it: "Italiano",
    }
</script>

<div class="nav">
    <span class="main">
        <a href={resolve("/")} class="brand">
            <img src={logo} class="size-15" alt="HexaBlue Logo" />
            <h1 class="title">{m.hexablue()}</h1>
        </a>
        <span class="links">
            <a href={resolve("/projects")}>{m.nav_projects()}</a>
            <a href={resolve("/news")}>{m.nav_news()}</a>
        </span>
    </span>
    <select name="lang" class="rounded-md" onchange={(e) => setLocale(e.currentTarget.value as Locale)}>
        {#each locales as locale (locale)}
            <option value="{locale}" class="bg-neutral-900 text-white" selected="{getLocale() === locale}">
                {codeToHuman[locale]}
            </option>
        {/each}
    </select>
</div>

<style lang="postcss">
    @import "../../base.css";

    .nav {
        @apply sticky w-[95] mx-auto inset-x-0 z-50;
        @apply grid md:flex md:justify-between justify-items-center gap-5 items-center origin-center;
        @apply m-8 p-4 rounded-xl border-gray-300 border;
        @apply bg-sky-900;

        @apply transition-all duration-300;
    }

    .nav .main {
        @apply flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8;
    }

    .nav .brand {
        @apply flex items-center gap-2;
    }

    .nav .title {
        @apply text-5xl font-black bg-hbcol hbcol-dark-0% hbcol-angle-45 bg-clip-text text-transparent;
    }

    .nav .links {
        @apply flex items-center gap-6 text-2xl font-semibold;

        :hover {
            @apply bg-clip-text bg-hbcol hbcol-dark-0% hbcol-angle-45 text-transparent;
        }
    }

    .nav:hover {
        @apply border-white;
        @apply -translate-y-1 drop-shadow-xl;
    }
</style>