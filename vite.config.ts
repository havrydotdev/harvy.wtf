import { defineConfig } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        svelte({
            preprocess: [vitePreprocess()],
            onwarn: (warning, handler) => {
                if (warning.code.startsWith("a11y-")) {
                    return; // silence a11y warnings
                }
                handler(warning);
            },
        }),
    ],
});
