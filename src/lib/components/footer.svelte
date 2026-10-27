<script lang="ts">
    import { resolve } from "$app/paths";
    import { localeHref } from "$lib";
    import { m } from "$lib/paraglide/messages";

    import logoWhite from "$lib/assets/main/hexablue_white.svg";
</script>

<footer class="footer">
    <a href={localeHref(resolve("/"))} class="brand">
        <img src={logoWhite} class="size-15" alt="HexaBlue Logo" />
        <span class="white title">{m.hexablue()}</span>
    </a>
    <p>{@html m["footer.desc"]()}</p>
    <p>{@html m["footer.joindc"]({ href: "https://discord.gg/DsARcGwwdM" })}</p>
</footer>

<style lang="postcss">
    @reference "../../base.css";

    .footer {
        @apply mx-auto mt-auto grid w-full;
        @apply justify-items-center gap-y-2;
        @apply rounded-t-4xl bg-mist-800 px-6 py-6 md:px-0;
        @apply text-gray-300;
    }
</style>
