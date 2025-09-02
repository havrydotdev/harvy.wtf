import { defineConfig } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import viteCompression from "vite-plugin-compression";

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
        viteCompression({ algorithm: "brotliCompress" }),
    ],
});
