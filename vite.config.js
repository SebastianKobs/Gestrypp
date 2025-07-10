import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    base: '/Gestrypp/',
    publicDir: 'assets',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                threed: resolve(__dirname, 'js/modules/renderer/3d/public/index.html'),
                pathfinding: resolve(__dirname, 'js/modules/pathfinding/public/index.html'),
            },
        },
    },
});
