import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'node',
        setupFiles: ['./src/test/setup.ts'],
        globals: true,
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/e2e/**',
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@quicksurvey/shared': path.resolve(__dirname, '../shared/src'),
        },
    },
});
