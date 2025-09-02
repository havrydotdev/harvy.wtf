<script lang="ts">
    import { flip } from "svelte/animate";
    import type { BspTree, Window } from "../bsp";

    let { windows = $bindable(), tree = $bindable() }: { windows: Window[]; tree: BspTree } = $props();

    const text =
        "                   -`                     harvy.wtf@web\r\n                  .o+`                    ----------------\r\n                 `ooo/                    OS: Arch linux x86_64\r\n                `+oooo:                   Model: ASUS TUF Gaming F15 FX506HC_FX506HC 1.0\r\n               `+oooooo:                  Kernel: web-0.0.1\r\n               -+oooooo+:                 Uptime: 7 hours, 49 mins\r\n             `/:-:++oooo+:                Packages: 0 (npm)\r\n            `/++++/+++++++:               Shell: web-shell 0.0.1\r\n           `/++++++++++++++:              Resolution: 1920x1080\r\n          `/+++ooooooooooooo/`            DE: WebDE\r\n         ./ooosssso++osssssso+`           WM: WebTiling\r\n        .oossssso-````/ossssss+`          Theme: Dark [GTK2/3]\r\n       -osssssso.      :ssssssso.         Icons: default [GTK2/3]\r\n      :osssssss/        osssso+++.        Terminal: qterminal\r\n     /ossssssss/        +ssssooo/-        Terminal Font: Source Code Pro 12\r\n   `/ossssso+/:-        -:/+osssso+-      CPU: 11th Gen Intel 15-11400H (12) @ 4.500GHz\r\n  `+sso+:-`                 `.-/+oso:     GPU: NVIDIA GeForce RTX 3050 Mobile\r\n `++:.                           `-/+/    Memory: 8546 / 15731MiB\r\n .`                                 ` \r\n                                         \u2B1B\uD83D\uDFE5\uD83D\uDFE9\uD83D\uDFEB\uD83D\uDFE6\uD83D\uDFEA\uD83D\uDFE6\u2B1B\r\n                                         \uD83D\uDFE9\uD83D\uDFE5\uD83D\uDFE9\uD83D\uDFE8\uD83D\uDFE6\uD83D\uDFEA\uD83D\uDFE6\u2B1C";
</script>

{#if windows.length != 0}
    {#each windows as window (window.id)}
        {@const isActive = window.id == tree.current.window?.id}
        {@const rect = window.rect}

        <!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
        <div
            animate:flip={{ duration: 300 }}
            class={`container ${isActive ? "active" : ""}`}
            style={`top: ${rect.y}px; left: ${rect.x}px; height: ${rect.h}px; width: ${rect.w}px`}
            onclick={() => (tree.current = tree.nodes().filter((n) => n.window?.id == window.id)[0])}
        >
            <div class="webfetch">
                <pre>{text}</pre>
            </div>
            <div class="input-line">
                <span id="prompt" class="prompt">harvy.wtf@zsh:/$ </span>
                <input
                    type="text"
                    class="input"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
                    {@attach (input) => {
                        if (isActive) input.focus();
                    }}
                />
            </div>
        </div>
    {/each}
{/if}

<style lang="scss">
    .container {
        position: absolute;

        color: white;
        background: rgba(0, 0, 0, 0.85);

        border-radius: 8px;
        font-family: monospace;
        white-space: pre;
    }

    .active {
        border: solid white;
        border-width: 1px;
    }

    .webfetch {
        display: flex;
        justify-content: center;
        padding-top: 35px;
    }

    .input-line {
        display: flex;
        gap: 3px;
        align-items: center;
        padding-left: 10px;
    }

    .input {
        background: none;
        border: none;
        color: #ffffff;
        caret-color: #ffffff;
        flex-grow: 1;
        outline: none;
        font-size: 16px;
    }
</style>
