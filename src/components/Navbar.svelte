<script>
    import Arch from "../icons/Arch.svelte";
</script>

<nav>
    <Arch />
    <span>{new Date().toLocaleTimeString()}</span>
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
