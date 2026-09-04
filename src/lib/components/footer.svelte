<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages";

    import logoWhite from "$lib/assets/main/hexablue_white.svg";
</script>

<footer class="footer">
    <a href={resolve("/")} class="brand">
        <img src={logoWhite} class="size-15" alt="HexaBlue Logo" />
        <h1 class="title white">{m.hexablue()}</h1>
    </a>
    <p>{@html m["footer.desc"]()}</p>
    <p>{@html m["footer.joindc"]({ href: "https://discord.gg/DsARcGwwdM" })}</p>
</footer>

<style lang="postcss">
	@reference "../../base.css";

    .footer {
        @apply grid mx-auto mt-auto w-full;
        @apply justify-items-center gap-y-2;
        @apply bg-mist-800 px-6 md:px-0 py-6 rounded-t-4xl;
        @apply text-gray-300;
    }
</style>