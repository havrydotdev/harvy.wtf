<script lang="ts">
    import "./scss/main.scss";

    import { newBspTree } from "./bsp";
    import { innerWidth as iw, innerHeight as ih } from "svelte/reactivity/window";
    import WindowTree from "./components/WindowTree.svelte";
    import Navbar from "./components/Navbar.svelte";

    // height and width of windows container
    let width = $derived(Math.round(((iw.current ?? 0) * 9.8) / 10));
    let height = $derived(Math.round(((ih.current ?? 0) * 9.4) / 10));

    let sideMargin = $derived(Math.round((iw.current ?? 0) * 0.1) / 10);

    let tree = $state(newBspTree({ x: 0, y: 0, h: height, w: width }));

    $effect(() => {
        tree.setRect({ x: 0, y: 0, h: height, w: width });
    });

    $effect(() => {
        $inspect(tree.nodes()).with(console.log);
    });

    let windows = $derived(tree.windows());

    type Keybind = { ctrl: Function; shift?: Function };
    const keybinds: { [key: string]: Keybind } = $derived({
        h: { ctrl: tree.left.bind(tree), shift: tree.shuffleLeft.bind(tree) },
        j: { ctrl: tree.down.bind(tree), shift: tree.shuffleDown.bind(tree) },
        k: { ctrl: tree.up.bind(tree), shift: tree.shuffleUp.bind(tree) },
        l: { ctrl: tree.right.bind(tree), shift: tree.shuffleRight.bind(tree) },
        q: { ctrl: tree.remove.bind(tree) },
        enter: {
            ctrl: () => {
                tree.addWindow({ title: "Terminal" });
            },
        },
    });

    function onKeyDown({ key, ctrlKey, shiftKey, repeat }: KeyboardEvent) {
        if (repeat || !ctrlKey) return;
        event?.preventDefault();

        const actualKey = key.toLowerCase();

        if (!keybinds[actualKey]) return;

        if (shiftKey && keybinds[actualKey].shift) {
            return keybinds[actualKey].shift();
        }

        return keybinds[actualKey].ctrl();
    }
</script>

<svelte:window on:keydown={onKeyDown} />

<Navbar />

<main class="screen" style={`left: ${sideMargin}px;  max-width: ${width}px; max-height: ${height}px`}>
    <WindowTree bind:windows bind:tree />
</main>

<style lang="scss">
    .screen {
        position: relative;
    }
</style>
