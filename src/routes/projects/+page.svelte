<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages";
    import { SEGGS_URL } from "$lib";

    import PageHead from "$lib/components/page-head.svelte";

    import dibsyLogo from "$lib/assets/projects/dibsy/dibsy.svg";
    import dibsyWordmark from "$lib/assets/projects/dibsy/dibsy_wordmark.svg"

    import seggsLogo from "$lib/assets/projects/seggs/seggs.svg";
</script>

<svelte:head>
    <title>{m["projects.title"]()}</title>
</svelte:head>

<PageHead
    title={m["projects.title"]()}
    description={m["projects.embed.description"]()}
    buttons={[
        { label: "dibsy", url: resolve("/projects#dibsy") },
        { label: "Server Eggs", url: SEGGS_URL }
    ]}
/>

<main>
    <h1 class="text-5xl font-extrabold">
        {m["nav.projects"]()}
    </h1>
    
    <section id="dibsy" class="sect proj">
        <img src={dibsyLogo} class="logo" alt="" />
        <span>
            <h2><img src={dibsyWordmark} class="h-16" alt="dibsy" /></h2>
            <p>{@html m["projects.dibsy.desc"]()}</p>
            <button class="gobtn" title={m["projects.dibsy.soon"]()} disabled>
                {m["projects.dibsy.visit"]()}
            </button>
        </span>
    </section>

    <section id="eggs" class="sect proj">
        <img src={seggsLogo} class="logo" alt="" />
        <span>
            <h2 class="seggs">Server Eggs</h2>
            <p>{@html m["projects.seggs.desc"]()}</p>
            <span class="more">
                <a
                    class="gobtn inline-block"
                    href={SEGGS_URL}
                    target="_blank"
                    rel="external noopener"
                >
                    {m["projects.seggs.visit"]()}
                </a>
            </span>
        </span>
    </section>
</main>

<style lang="postcss">
    @reference "../../base.css";

    .sect.proj {
        @apply flex flex-col md:flex-row justify-center items-center gap-x-12;

        span {
            @apply justify-items-center md:justify-items-normal md:text-left;

            &.more {
                @apply grid lg:flex gap-x-4 gap-y-2;
            }
        }

        .logo {
            @apply h-64;
        }

        .seggs {
            @apply text-5xl font-gsans font-extrabold mb-2 lg:mb-1;
        }
    }
</style>