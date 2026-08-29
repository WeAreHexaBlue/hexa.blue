<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages";

    import logoWhite from "$lib/assets/hexablue_white.svg";
</script>

<div class="footer">
    <a href={resolve("/")} class="brand">
        <img src={logoWhite} class="size-15" alt="HexaBlue Logo" />
        <h1 class="title white">{m.hexablue()}</h1>
    </a>
    <p class="text-gray-300">{m.footer_desc()}</p>
</div>

<style lang="postcss">
    @import "../../base.css";

    .footer {
        @apply absolute grid mx-auto w-full bottom-0;
        @apply justify-items-center gap-y-2;
        @apply bg-mist-800 py-6 rounded-t-4xl;
    }
</style>