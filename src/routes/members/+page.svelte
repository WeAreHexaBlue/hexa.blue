<script lang="ts">
    import { m } from "$lib/paraglide/messages";

    import flamey from "$lib/assets/members/flamey.png";

    type Index = keyof typeof m extends infer K
        ? K extends `members.members.${infer Name}`
            ? Name
            : never
        : never;
</script>

<svelte:head>
    <title>{m["members.title"]()}</title>
</svelte:head>
<main>
    <h1 class="text-5xl font-extrabold">
        {m["nav.members"]()}
    </h1>

    {#snippet list(index: Index, tag: string, joiner: string)}
        {@html (m[`members.members.${index}`])()
            .split(", ")
            .map(part => `<${tag}>${part}</${tag}>`)
            .join(joiner)
        }
    {/snippet}

    <span class="sect spangrid lg:grid-cols-3 2xl:grid-cols-5">
        <span class="lg:col-start-2 2xl:col-start-3"> <!-- Slight hack: since the row isn't filled, make it centered with this. Remove later. -->
            <img src={flamey} class="icon" alt="Flamey icon" />
            <h1>Flamey</h1>
            <sub>{@render list("flamey.roles", "b", ", ")}</sub>
            <p>{@html m["members.members.flamey.bio"]()}</p>
            <p>
                <b>{m["members.projects"]()}</b>:<br />{@render list("flamey.projects", "i", "<br />")}
            </p>
        </span>
    </span>
</main>

<style lang="postcss">
    @reference "../../base.css";

    .icon {
        @apply rounded-2xl size-64;
    }

    sub {
        @apply text-mist-300;
    }
</style>