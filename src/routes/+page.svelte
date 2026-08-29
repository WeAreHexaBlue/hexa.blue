<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import { fade } from "svelte/transition";

    import logo from "$lib/assets/hexablue.svg";

    const heroCycle = [m.hero_cycle_open(), m.hero_cycle_revol(), m.hero_cycle_future(), m.hero_cycle_foryou()]
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
    <div class="introbg">
        <img src={logo} id="biglogo" alt="HexaBlue Logo" />
    </div>
    <div class="herosect">
        <span class="hero">
            <h1 class="gradtxt">{m.hexablue()}</h1>
            <h1>{m.hero_is()}</h1>
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
            {@html m.hero_desc()}
        </p>
    </div>
</main>

<style lang="postcss">
    @import "../base.css";

    .introbg {
        @apply absolute top-0 w-full h-200 -z-50 overflow-hidden;
        @apply bg-hbcol hbcol-dark-50% hbcol-angle-0;
    }

    .herosect {
        @apply mt-40 md:mt-60 md:ml-30 md:justify-start md:text-left;
        @apply px-6 md:px-0;
    }

    .hero {
        @apply md:inline-flex flex flex-wrap justify-center gap-x-3;
        @apply text-6xl font-black leading-tight;
    }

    .hero .cycle {
        @apply inline-grid;

        * {
            @apply col-start-1 row-start-1;
        }
    }

    .herosect .desc {
        @apply mx-auto md:mx-0 mt-4 md:mt-0 inset-x-0 max-w-3xl;
        @apply text-xl;
    }

    #biglogo {
        @apply absolute size-150 top-15 md:top-0 pointer-events-none select-none;

        @apply left-1/2 -translate-x-1/2 translate-y-1/4;
        @apply opacity-60 xl:opacity-100;

        @apply xl:left-auto xl:right-40 xl:top-40 xl:bottom-auto;
        @apply xl:translate-x-0 xl:translate-y-0;
    }
</style>