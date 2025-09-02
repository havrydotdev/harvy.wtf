<script lang="ts">
    import Arch from "../icons/Arch.svelte";

    let { title }: { title: string } = $props();
    let date = $state(new Date());

    $effect(() => {
        const interval = setInterval(() => {
            date = new Date();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });
</script>

<nav>
    <div>
        <Arch />
        <span>{title}</span>
    </div>
    <span
        >{new Intl.DateTimeFormat("en-GB", {
            dateStyle: "short",
            timeStyle: "short",
        }).format(date)}</span
    >
</nav>

<style lang="scss">
    nav {
        display: flex;
        justify-content: space-between;
        min-height: 30px;
        max-width: 98%;
        margin: 7px auto;
        border-radius: 8px;
        padding: 10px;
        color: white;
        background-color: rgba(0, 0, 0, 0.85);
    }
</style>
