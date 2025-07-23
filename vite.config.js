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
                pathfinding_a_star: resolve(__dirname, 'js/modules/pathfinding/a-star/public/index.html'),
                pathfinding_mst: resolve(__dirname, 'js/modules/pathfinding/minimum-spanning-tree/public/index.html'),
                pathfinding_mst_animated: resolve(__dirname, 'js/modules/pathfinding/minimum-spanning-tree/public/animated.html'),
                particle_life: resolve(__dirname, 'js/modules/particle/public/index.html'),
            },
        },
    },
});
