<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages";

    import { fade } from "svelte/transition";

    import logo from "$lib/assets/hexablue.svg";

    import dibsyLogo from "$lib/assets/dibsy.svg";
    import dibsyWordmark from "$lib/assets/dibsy_wordmark.svg";
    import seggsLogo from "$lib/assets/seggs.svg";

    const heroCycle = [m["home.hero.cycle.open"](), m["home.hero.cycle.revol"](), m["home.hero.cycle.future"](), m["home.hero.cycle.foryou"]()]
    let index = $state(0)

    $effect(() => {
        const interval = setInterval(() => {
            index = (index + 1) % heroCycle.length;
        }, 2000);

        return () => clearInterval(interval);
    });
</script>

<svelte:head>
    <title>{m.hexablue()}</title>
</svelte:head>
<main>
    <section class="intro">
        <div class="introbg">
            <img src={logo} id="biglogo" alt="HexaBlue Logo" />
        </div>
        <div class="herosect">
            <span class="hero">
                <span class="prefix">
                    <h1 class="gradtxt">{m.hexablue()}</h1>
                    <h1>{m["home.hero.is"]()}</h1>
                </span>
                <span class="cycle" aria-live="polite">
                    <!-- The invisible words are rendered to consistently wrap text on small screens. -->
                    {#each heroCycle as word (word)}
                        <span class="invisible select-none pointer-events-none" aria-hidden="true">
                            {word}
                        </span>
                    {/each}

                    {#key index}
                        <h1 class="gradtxt" in:fade={{ duration: 300, delay: 300 }} out:fade={{ duration: 300 }}>{heroCycle[index]}</h1>
                    {/key}
                </span>
            </span>
            <p class="desc">
                {@html m["home.hero.desc"]()}
            </p>
        </div>
    </section>
    
    <section id="about" class="sect">
        <h1>
            <a href={resolve("/#about")}>{m["home.about.title"]()}</a>
        </h1>
        <p>{@html m["home.about.desc"]()}</p>
    </section>

    <section id="projects" class="sect">
        {#snippet moreProject(name: string)}
            <a href={resolve(`/projects#${name}`)} class="hmore">
                {m["home.project_overview.more"]()}
            </a>
        {/snippet}

        <h1>
            <a href={resolve("/#projects")}>{m["home.project_overview.title"]()}</a>
        </h1>
        <span>
            <span class="projbrand">
                <img src={dibsyLogo} alt="dibsy Logo" />
                <img src={dibsyWordmark} alt="dibsy" />
            </span>
            <p>{@html m["home.project_overview.dibsy"]()}</p>
            {@render moreProject("dibsy")}
        </span>
        <span>
            <span class="projbrand">
                <img src={seggsLogo} alt="Server Eggs Logo" />
                <h1 class="seggs">Server Eggs</h1>
            </span>
            <p>{@html m["home.project_overview.seggs"]()}</p>
            {@render moreProject("eggs")}
        </span>
    </section>
</main>

<style lang="postcss">
	@reference "../base.css";

    .intro {
        @apply relative z-0 w-full min-h-200 flex flex-col justify-start;
        @apply -mt-50 sm:-mt-40 pt-50 sm:pt-40;
    }

    .introbg {
        @apply absolute top-0 w-full h-200 -z-50 overflow-hidden;
        @apply bg-hbcol hbcol-dark-50% hbcol-angle-0;
    }

    .herosect {
        @apply mt-44 xl:mt-60 px-6 xl:px-0;
        @apply flex flex-col items-center text-center;
        @apply xl:items-start xl:text-left xl:ml-30;
    }

    .hero {
        @apply flex flex-col xl:flex-row items-center justify-center xl:justify-start gap-x-3;
        @apply text-6xl font-black leading-tight;
    }

    .hero .prefix {
        @apply flex flex-wrap justify-center xl:justify-start gap-x-3;
    }

    .hero .cycle {
        @apply inline-grid xl:text-left;

        * {
            @apply col-start-1 row-start-1;
        }
    }

    .herosect .desc {
        @apply mt-2 xl:mt-0 max-w-2xl xl:max-w-3xl text-xl;
        @apply mx-auto xl:mx-0;
    }

    #biglogo {
        @apply absolute size-150 top-15 sm:top-0 pointer-events-none select-none;

        @apply left-1/2 -translate-x-1/2 translate-y-1/4;
        @apply opacity-60 xl:opacity-100;

        @apply xl:left-auto xl:right-40 xl:top-40 xl:bottom-auto;
        @apply xl:translate-x-0 xl:translate-y-0;
    }
</style>