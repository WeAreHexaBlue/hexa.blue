<script lang="ts">
    import logo from "$lib/assets/hexablue.svg"
	import { resolve } from "$app/paths";
</script>

<div class="nav">
    <a href={resolve("/")}>
        <div class="flex gap-2 items-center">
            <img src={logo} class="size-15" alt="HexaBlue Logo" />
            <h1 class="text-5xl font-black bg-rainbow rainbow-dark-0 bg-clip-text text-transparent">
                HexaBlue
            </h1>
        </div>
    </a>
</div>

<style lang="postcss">
    @import "../../base.css";

    .nav {
        @apply flex justify-center items-center origin-center;
        @apply m-8 p-4 rounded-xl border-gray-300 border;
        @apply bg-rainbow rainbow-dark-50 rainbow-angle-135;

        @apply transition-all duration-300;
    }

    .nav:hover {
        @apply border-white;
        @apply -translate-y-1 drop-shadow-xl;
    }
</style>